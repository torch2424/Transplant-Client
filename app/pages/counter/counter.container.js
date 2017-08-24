import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from './counter';
import * as CounterActions from './counter.action';

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
