import { defineComponent, h, onMounted, onUnmounted, ref, type PropType, type VNode } from 'vue'
import "./TruncateList.css"

const PIXEL_TOLERANCE = 0.001;

const rectContainsRect = (parent: DOMRect, child: DOMRect) => {
  return (
    child.left >= parent.left - PIXEL_TOLERANCE &&
    child.right <= parent.right + PIXEL_TOLERANCE &&
    child.top >= parent.top - PIXEL_TOLERANCE &&
    child.bottom <= parent.bottom + PIXEL_TOLERANCE
  )
}

export default defineComponent({
  name: 'TruncateList',
  props: {
    renderTruncator: {
      type: Function as PropType<({ hiddenItemsCount, truncate }: { hiddenItemsCount: number, truncate: () => void }) => string | VNode>,
      required: true
    },
    alwaysShowTruncator: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    const { renderTruncator, alwaysShowTruncator } = props;
    const containerRef = ref<HTMLUListElement>();
    if (!slots.default) {
      throw new Error('TruncateList requires at least one child');
    }
    const children = slots.default();

    const truncate = () => {
      const container = containerRef.value;
      if (!container) {
        return;
      }

      const childNodes = container.children;
      const isLastItemFit = (lastItem: Element) => rectContainsRect(
        container.getBoundingClientRect(),
        lastItem.getBoundingClientRect()
      );

      /**
       * Initialization
       */
      // Change from a scrollable container to a non-scrollable container: hidden during hydration
      container.style.overflow = 'hidden';
      // Show all items, hide all truncators
      for (let i = 0; i < childNodes.length; i++) {
        childNodes[i].hidden = i % 2 === 0;
      }
      // If there are no items (this last truncator is always included), return.
      if (childNodes.length === 0) {
        return;
      }

      /**
       * Test if truncation is necessary.
       */
      if (alwaysShowTruncator) {
        const lastItem = childNodes[childNodes.length - 1];
        lastItem.hidden = false;
        // if last item is fit, return
        if (isLastItemFit(lastItem)) {
          return;
        }
        lastItem.hidden = true;
      } else {
        const lastItem = childNodes[childNodes.length - 2];
        // if last item is fit, return
        if (isLastItemFit(lastItem)) {
          return;
        }
      }

      /**
       * Truncation is necessary.
       * Binary search to find the the last truncator that can fit.
       */
      const numTruncators = children.length;
      let left = 0;
      let right = numTruncators - 1;
      let truncatorIndex = -1;

      while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        
        // show all items before the truncator
        for (let i = 0; i < middle; i++) {
          childNodes[i * 2 + 1].hidden = false;
        }
        // hide all items after the truncator
        for (let i = middle; i < numTruncators; i++) {
          childNodes[i * 2 + 1].hidden = true;
        }

        const truncatorElement = childNodes[middle * 2];
        truncatorElement.hidden = false;

        if (isLastItemFit(truncatorElement)) {
          // try to find a larger truncator
          truncatorIndex = middle;
          left = middle + 1; 
        } else {
          // try to find a smaller truncator
          right = middle - 1; 
        }
        truncatorElement.hidden = true;
      }

      // If no truncator is found, everything is hidden at this point, return.
      if (truncatorIndex === -1) {
        return;
      }

      /**
       * Now we know the last truncator that can fit, show it.
       */
      // Show all items before the truncator.
      for (let i = 0; i < truncatorIndex; i++) {
        childNodes[i * 2 + 1].hidden = false;
      }
      // hide all truncators after the truncator
      for (let i = truncatorIndex; i < numTruncators; i++) {
        childNodes[i * 2 + 1].hidden = true;
      }
      const truncatorElement = childNodes[truncatorIndex * 2];
      truncatorElement.hidden = false;
    }

    const items = children.map((item, index) => {
      return [
        h('li', { hidden: true }, renderTruncator({ hiddenItemsCount: children.length - index, truncate })),
        h('li', {}, item)
      ]
    });

    const resizeObserver = new ResizeObserver(() => {
      truncate();
    })

    onMounted(() => {
      truncate();
      containerRef.value && resizeObserver.observe(containerRef.value);
    })

    onUnmounted(() => {
      containerRef.value && resizeObserver.unobserve(containerRef.value)
    })

    return () => {
      return h('ul', { class: 'v-truncate-list', ref: containerRef }, [
        ...items.flat(),
        h('li', { hidden: true }, renderTruncator({ hiddenItemsCount: 0, truncate }))
      ])
    }
  }
})
