import PropTypes from 'prop-types';
import { MFMapView } from '../MFMapView';

const banDoSoPropTypes = {
  ...MFMapView.propTypes,

  /**
   * If `true` (default), fetch category config and vector tiles from the staging API.
   * If `false`, use the production API (no `/staging` path segment).
   */
  isStaging: PropTypes.bool,
};

export { banDoSoPropTypes };
