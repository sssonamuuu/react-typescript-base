import React, { useEffect } from 'react';
import usePlaceholder from 'hooks/usePlaceholder';
import BasePlaceholder from 'components/basePlaceholder';
import BaseCard from 'components/baseCard';

export default () => {
  const [placeholder, setPlaceholder] = usePlaceholder();

  useEffect(() => {
    setTimeout(() => {
      setPlaceholder(null);
    }, 1000);
  }, []);

  if (placeholder) {
    return <BasePlaceholder status={placeholder} />;
  }

  return (
    <BaseCard title="首页">首页</BaseCard>
  );
};
