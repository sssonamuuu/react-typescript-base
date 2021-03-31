import React from 'react';

export function onKeyDownIfEnter (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, onKwyDown: Function) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    onKwyDown();
  }
}
