/* @flow */

import React from 'react';
import { Editor } from '../../src';

const CustomImage = () =>
  (<div className="rdw-storybook-root">
    <h3>Custom onClick image event.</h3>
    <Editor
      toolbarClassName="rdw-storybook-toolbar"
      wrapperClassName="rdw-storybook-wrapper"
      editorClassName="rdw-storybook-editor"
      toolbar={{
        image: {
          onClick: () => {
              alert('aaa');
          },
          previewImage: true,
        },
      }}
    />
  </div>);

export default CustomImage;
