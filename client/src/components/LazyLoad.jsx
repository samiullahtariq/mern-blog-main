import React, { Suspense } from 'react';

const LazyLoad = ({ loader, fallback = null, ...rest }) => {
  const Component = React.lazy(loader);

  return (
    <Suspense fallback={fallback}>
      <Component {...rest} />
    </Suspense>
  );
};

export default LazyLoad;
