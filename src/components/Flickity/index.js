/* eslint-disable no-param-reassign */

import React, { memo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import F from 'react-flickity-component';

function Flickity({ dragging, flickityRef, ...props }) {
  const flkty = useRef(null);
  const setFlickityRef = useCallback(c => {
    flkty.current = c;
    if (flickityRef) flickityRef.current = c;
  }, []);

  useEffect(() => {
    if (flkty.current && dragging) {
      flkty.current.on('dragStart', () => {
        dragging.current = true;
      });
      flkty.current.on('dragEnd', () => {
        setTimeout(() => {
          dragging.current = false;
        }, 0);
      });
    }
  }, []);
  return <F flickityRef={setFlickityRef} {...props} />;
}
Flickity.propTypes = {
  dragging: PropTypes.object,
  flickityRef: PropTypes.object,
};
export default memo(Flickity);
