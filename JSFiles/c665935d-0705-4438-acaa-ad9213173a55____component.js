import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ExtensionView } from '../extension-view';
import { ExtensionViewButton } from '../extension-view-button';
import { EXTENSION_MODE_TO_VIEW } from '../constants/extension-modes.js'
import './component.sass';
const { ExtensionMode } = window['extension-coordinator'];

export class ExtensionViewContainer extends Component {
  openExtensionViewDialog = () => {
    this.props.openExtensionViewHandler();
  }

  render() {
    if (this.props.mode !== ExtensionMode.Viewer) {
      return ( <ExtensionView
          id={this.props.mode}
          type={EXTENSION_MODE_TO_VIEW[this.props.mode]}
          extension={this.props.extension}
          mode={this.props.mode}
          key={this.props.mode}/>
      );
    }

    let extensionViews = [];
    if (this.props.extensionViews) {
      extensionViews = this.props.extensionViews.map(view => {
        return <ExtensionView
          key={view.id}
          id={view.id}
          extension={view.extension}
          type={view.type}
          mode={this.props.mode}
          role={view.role}
          overlaySize={view.overlaySize}
          position={{x: view.x, y: view.y}}
          linked={view.linked}
          openEditViewHandler={this.props.openEditViewHandler}
          deleteViewHandler={this.props.deleteExtensionViewHandler}/>
      });
    }

    return (
      <div className='view-container-wrapper'>
          <div className="view-container">
          { extensionViews }
        </div>
        <div>
          <ExtensionViewButton
            onClick={this.openExtensionViewDialog}>
          </ExtensionViewButton>
        </div>
      </div>
    );
  }
}

ExtensionViewContainer.propTypes = {
  mode: PropTypes.string.isRequired,
  extensionViews: PropTypes.array.isRequired,
  openEditViewHandler: PropTypes.func,
  deleteExtensionViewHandler: PropTypes.func.isRequired,
  openExtensionViewHandler: PropTypes.func.isRequired,
  extension: PropTypes.object.isRequired,
}
