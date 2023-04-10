import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; //parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No result found for your query, Please Try another one!';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
