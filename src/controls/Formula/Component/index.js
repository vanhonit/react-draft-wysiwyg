import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Option from '../../../components/Option';
import './styles.css';

class LayoutComponent extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    doCollapse: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  state = {
    formula: ''
  };

  componentDidUpdate(prevProps) {
    if (prevProps.expanded && !this.props.expanded) {
      this.setState({
        formula: ''
      });
    }
  }

  onDragEnter = event => {
    this.stopPropagation(event);
    this.setState({
      dragEnter: true,
    });
  };



  addFormulaFromState = () => {
    const { formula } = this.state;
    const { onChange } = this.props;
    onChange(formula);
  };

  showImageURLOption = () => {
    this.setState({
      uploadHighlighted: false,
    });
  };

  toggleShowImageLoading = () => {
    const showImageLoading = !this.state.showImageLoading;
    this.setState({
      showImageLoading,
    });
  };

  updateValue = event => {
    this.setState({
      [`${event.target.name}`]: event.target.value,
    });
  };


  stopPropagation = event => {
    if (!this.fileUpload) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.fileUpload = false;
    }
  };

  renderAddFormulaModal() {
    const {
      formula,
    } = this.state;
    const {
      config: {
        popupClassName
      },
      doCollapse,
      translations,
    } = this.props;
    return (
      <div
        className={classNames('rdw-image-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <div className="rdw-image-modal-url-section">
          <input
            className="rdw-image-modal-url-input"
            placeholder={translations['components.controls.image.enterlink']}
            name="formula"
            onChange={this.updateValue}
            onBlur={this.updateValue}
            value={formula}
          />
          <span className="rdw-image-mandatory-sign">*</span>
        </div>

        <span className="rdw-image-modal-btn-section">
          <button
            className="rdw-image-modal-btn"
            onClick={this.addFormulaFromState}
            disabled={!formula}
          >
            {translations['generic.add']}
          </button>
          <button className="rdw-image-modal-btn" onClick={doCollapse}>
            {translations['generic.cancel']}
          </button>
        </span>
      </div>
    );
  }

  onClick = () => {
    const { onExpandEvent, onChange, config } = this.props;
    const { onClick } = config;
    if (onClick) {
      onClick(onChange);
    } else {
      onExpandEvent();
    }
  }

  render() {
    const {
      config: { icon, className, title },
      expanded,
      onExpandEvent,
      translations,
    } = this.props;
    return (
      <div
        className="rdw-image-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-image-control"
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={onExpandEvent}
          title={title || translations['components.controls.image.image']}
        >
          <img src={icon} alt="" />
        </Option>
        {expanded ? this.renderAddFormulaModal() : undefined}
      </div>
    );
  }
}

export default LayoutComponent;