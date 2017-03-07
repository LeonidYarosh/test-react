import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class InputFilter extends Component {
  state = {
    value: '',
  }

  static propTypes = {
    placeholderInput: PropTypes.string.isRequired,
    changeInputFilter: PropTypes.func.isRequired,
    resetFilterInput: PropTypes.func.isRequired,
    filterData: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  }

  changeInput = (e) => {
    this.setState({
      value: e.target.value,
    }, this.props.changeInputFilter(e.target.value))
  }

  reset = () => {
    this.setState({
      value: '',
    }, this.props.resetFilterInput(this.props.name))
  }

  handleInputKeyDown = (e) => {
    if (e.keyCode === 13 && this.state.value !== '') {
      this.props.filterData()
    }
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
          onKeyDown={this.handleInputKeyDown}
        />
        <div
          className={cx({'show-block': this.state.value !== ''}, 'delete-input-filter hide-block')}
          onClick={this.reset}
        >&#10006;</div>
      </div>

    )
  }
}
