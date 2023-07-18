import {
  onMounted, onUnmounted, Ref, ref,
} from 'vue';

export type TouchType = 'left' | 'right' | 'up' | 'down' | '';

function useSwipe(container: Ref<HTMLElement>) {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const touch = ref<TouchType>('');

  const handleGesure = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        touch.value = 'right';
      } else {
        touch.value = 'left';
      }
    } else if (deltaY > 0) {
      touch.value = 'down';
    } else {
      touch.value = 'up';
    }
    setTimeout(() => { touch.value = ''; });
  };

  const onTouchStart = (event: TouchEvent) => {
    touchStartX = event.changedTouches?.[0]?.screenX;
    touchStartY = event.changedTouches?.[0]?.screenY;
  };

  const onTouchEnd = (event: TouchEvent) => {
    touchEndX = event.changedTouches?.[0]?.screenX;
    touchEndY = event.changedTouches?.[0]?.screenY;
    handleGesure();
  };

  onMounted(() => {
    container.value.addEventListener('touchstart', onTouchStart);
    container.value.addEventListener('touchend', onTouchEnd);
  });

  onUnmounted(() => {
    container.value.addEventListener('touchstart', onTouchStart);
    container.value.addEventListener('touchend', onTouchEnd);
  });

  return {
    touch,
  };
}

export default useSwipe;
