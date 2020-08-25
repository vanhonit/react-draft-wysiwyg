import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RichUtils, EditorState, Modifier } from 'draft-js';
import {
  getSelectionText,
  getEntityRange,
  getSelectionEntity,
} from 'draftjs-utils';

import LayoutComponent from './Component';


class Formula extends Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { editorState, modalHandler } = this.props;
    this.state = {
      expanded: false,
      link: undefined,
      selectionText: undefined,
      currentEntity: editorState ? getSelectionEntity(editorState) : undefined,
    };
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentDidUpdate(prevProps) {
    const { editorState } = this.props;
    if (editorState && editorState !== prevProps.editorState) {
      this.setState({ currentEntity: getSelectionEntity(editorState) });
    }
  }

  componentWillUnmount() {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  onExpandEvent = () => {
    this.signalExpanded = !this.state.expanded;
  };

  onChange = (action, title, target, targetOption) => {
    const {
      config: { linkCallback },
    } = this.props;

    if (action === 'link') {
      const linkifyCallback = linkCallback || linkifyLink;
      const linkified = linkifyCallback({ title, target, targetOption });
      this.addLink(linkified.title, linkified.target, linkified.targetOption);
    } else {
      this.removeLink();
    }
  };

  getCurrentValues = () => {
    const { editorState } = this.props;
    const { currentEntity } = this.state;
    const contentState = editorState.getCurrentContent();
    const currentValues = {};
    if (
      currentEntity &&
      contentState.getEntity(currentEntity).get('type') === 'LINK'
    ) {
      currentValues.link = {};
      const entityRange =
        currentEntity && getEntityRange(editorState, currentEntity);
      currentValues.link.target =
        currentEntity && contentState.getEntity(currentEntity).get('data').url;
      currentValues.link.targetOption =
        currentEntity &&
        contentState.getEntity(currentEntity).get('data').targetOption;
      currentValues.link.title = entityRange && entityRange.text;
    }
    currentValues.selectionText = getSelectionText(editorState);
    return currentValues;
  };

  doExpand = () => {
    this.setState({
      expanded: true,
    });
  };

  expandCollapse = () => {
    this.setState({
      expanded: this.signalExpanded,
    });
    this.signalExpanded = false;
  };

  doCollapse = () => {
    this.setState({
      expanded: false,
    });
  };
  
  addFormula = (formula) => {
    const { editorState, onChange } = this.props;
    const entityData = { formula };
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('KATEX', 'MUTABLE', entityData)
      .getLastCreatedEntityKey();
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      formula,
      editorState.getCurrentInlineStyle(),
      entityKey
    );
    onChange(EditorState.push(editorState, contentState, 'insert-formula'));
    this.doCollapse();
  }


  render() {
    const { config, translations } = this.props;
    const { expanded } = this.state;
    const FormulaComponent = config.component || LayoutComponent;
    return (
      <FormulaComponent
        config={config}
        translations={translations}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onChange={this.addFormula}
      />
    );
  }
}

export default Formula;
