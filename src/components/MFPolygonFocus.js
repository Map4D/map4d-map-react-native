import React from 'react';
import PropTypes from 'prop-types';
import {MFPolygon} from './MFPolygon';

class MFPolygonFocus extends MFPolygon {
  render() {
    const {id, ...restProps} = this.props;
    return (
      <MFPolygon
        {...restProps}
        ref={this._ref}
        onPress={this._onPress}
      />
    );
  }
}

MFPolygonFocus.propTypes = {
  ...MFPolygon.propTypes,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export {MFPolygonFocus};