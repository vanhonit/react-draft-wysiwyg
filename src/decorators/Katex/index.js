import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InlineMath } from 'react-katex';;
import 'katex/dist/katex.min.css';

function findKatexEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'KATEX'
      );
    },
    callback,
  );
}

function getKatexComponent(config) {
  return class Katex extends Component {
    static propTypes = {
      entityKey: PropTypes.string.isRequired,
      children: PropTypes.array,
      contentState: PropTypes.object,
    };

    render() {
      const { entityKey, contentState } = this.props;
      const { formula } = contentState.getEntity(entityKey).getData();
      return <InlineMath math={formula} />;
    }
  };
}

export default config => ({
  strategy: findKatexEntities,
  component: getKatexComponent(config),
});
