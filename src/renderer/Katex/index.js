
import React, { Component } from 'react';
import { InlineMath } from 'react-katex';
import PropTypes from 'prop-types';
import 'katex/dist/katex.min.css';

const getKatexComponent = config => class Katex extends Component {
  static propTypes: Object = {
    block: PropTypes.object,
    contentState: PropTypes.object,
  };

  render(): Object {
    const { block, contentState } = this.props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const { formula } = entity.getData();

    return <InlineMath math={formula} />;
  }
};

export default getKatexComponent;
