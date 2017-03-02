import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class InputFilter extends Component {
  state = {
    value: '',
  }

  static propTypes = {
    placeholderInput: PropTypes.string.isRequired,
    inputFilterDefinition: PropTypes.func.isRequired,
  }

  changeInput = (e) => {
    this.setState({
      value: e.target.value,
    }, this.props.inputFilterDefinition(e.target.value))
  }

  reset = () => {
    this.setState({
      value: '',
    }, this.props.inputFilterDefinition(''))
  }

  render() {
    const {
      placeholderInput,
    } = this.props

    return (
      <div className="input-filter-box">
        <input
          type="text"
          className="input-filter"
          placeholder={placeholderInput}
          value={this.state.value}
          onChange={this.changeInput}
        />
        <div
          className={cx({'show-block': this.state.value !== ''}, 'delete-input-filter hide-block')}
          onClick={this.reset}
        >&#10006;</div>
      </div>

    )
  }
}
