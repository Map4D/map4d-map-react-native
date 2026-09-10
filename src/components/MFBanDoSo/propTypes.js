import PropTypes from 'prop-types';
import { MFMapView } from '../MFMapView';

const banDoSoPropTypes = {
  ...MFMapView.propTypes,

  /**
   * If `false` (default), use the production API (no `/staging` path segment).
   * If `true`, fetch category config and vector tiles from the staging API.
   */
  isStaging: PropTypes.bool,
};

export { banDoSoPropTypes };
