import Dropzone from 'react-dropzone';
import { Link } from 'react-router';
import React from 'react';

import DescriptionEditor from './DescriptionEditor.jsx';
import EntryImage from './EntryImage.jsx';
import EntryTextField from './EntryTextField.jsx';
import SourceLink from './SourceLink.jsx';
import TagEditor from './TagEditor.jsx';

// Represents a single hivemind database entry
export default class Entry extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeDescription = (rawContentState) => {
      this.props.onChange({...this.props.entry, description: rawContentState});
    };

    this.onChangeTitle = (newTitle) => {
      this.props.onChange({...this.props.entry, title: newTitle});
    };

    this.onChangeAuthor = (newAuthor) => {
      this.props.onChange({...this.props.entry, author: newAuthor});
    };

    this.onChangeURL = (newURL) => {
      this.props.onChange({...this.props.entry, URL: newURL});
    };

    this.onChangeTags = (newTags) => {
      this.props.onChange({...this.props.entry, tags: newTags});
    };

    this.onDelete = (event) => {
      if (window.confirm("Are you sure you want to delete this entry? There is no undo.")) {
        this.props.onDelete();
      }
      event.preventDefault();
    };
  }

  render() {
    const bottomControls =
      <div className="bottomControls">
        {this.props.disabled ? null : <a href="#" onClick={this.onDelete} className="delete">Delete</a>}
        <Link to={`/entry/${this.props.entry._id}`} className="permalink">Permalink</Link>
      </div>;

    const dates =
      <div className="dates">
        <span>Added on {this.props.entry.createdAt.toLocaleDateString("en-us", {year: "2-digit", month: "2-digit", day: "2-digit"})}.</span>
        <span>Updated on {this.props.entry.updatedAt.toLocaleDateString("en-us", {year: "2-digit", month: "2-digit", day: "2-digit"})}.</span>
      </div>;

    const descriptionEditor =
      <DescriptionEditor
        value={this.props.entry.description}
        onChange={this.onChangeDescription}
        disabled={this.props.disabled}
      />;

    const tagEditor =
      <TagEditor
        onChange={this.onChangeTags}
        tags={this.props.entry.tags}
        disabled={this.props.disabled}
      />;

    const hasValidImage = (this.props.entry.imageURL || "") !== "";
    let contents;
    if (hasValidImage) {
      contents = (
        <div className="contents">
          <div className="leftColumn">
            <div className="entryImage">
              <EntryImage
                onDropImage={this.props.onDropImage}
                imageURL={this.props.entry.imageURL}
              />
              {dates}
              {bottomControls}
            </div>
          </div>
          <div className="notes">
            {descriptionEditor}
            {tagEditor}
          </div>
        </div>
      );
    } else {
      contents = (
        <Dropzone
          onDrop={this.props.onDropImage}
          multiple={false}
          accept="image/*"
          style={{}}
          disableClick={true}
        >
          <div className="contents oneColumn">
            <div className="notes">
              {descriptionEditor}
              <div className="tagEditorAndControls">
                {tagEditor}
                {dates}
              </div>
              {bottomControls}
            </div>
          </div>
        </Dropzone>
      );
    }

    return (
      <div className={"entry" + (this.props.disabled ? "" : " editable")}>
        <header>
          <span className="title">
            <EntryTextField
              className="title"
              value={this.props.entry.title}
              onChange={this.onChangeTitle}
              placeholder="Title"
              disabled={this.props.disabled}
            />
          </span>
          <span className={"author " + (((this.props.entry.author || "") === "") ? "hidden-until-hover" : "")}>
            &nbsp;by&nbsp;<EntryTextField
              value={this.props.entry.author}
              onChange={this.onChangeAuthor}
              placeholder="Author"
              disabled={this.props.disabled}
            />
          </span>
          <SourceLink
            onChange={this.onChangeURL}
            URL={this.props.entry.URL}
            disabled={this.props.disabled}
          />
        </header>
        {contents}
      </div>
    );
  }
}
