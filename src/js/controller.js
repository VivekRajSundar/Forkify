import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SEC } from './config';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

// import icons from "../img/icons.svg"; // parcel 1
// import icons from 'url:../img/icons.svg'; //parcel 2
import 'core-js/stable'; // polyfill everything
import 'regenerator-runtime/runtime'; // for polyfilling async/await

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //getting hash from the url
    const id = window.location.hash.slice(1);

    //if there is no id, just return
    if (!id) return;
    recipeView.renderSpinner();

    //0. Update results view to mark selected search results
    resultsView.update(model.getResultsPage());

    //1. Updating bookmarks recipe
    bookmarksView.update(model.state.bookmarks);

    //2. Loading recipe
    await model.loadRecipe(id);

    //3. Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1. Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    //2. Load search Results
    resultsView.renderSpinner(); // load spinner while getting results
    await model.loadSearchResults(query);

    //3. Render Search Results
    resultsView.render(model.getResultsPage());

    //4. Render initial Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  //1. Render NEW Search Results
  resultsView.render(model.getResultsPage(page));

  //2. Render NEW Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1. Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. Update recipe View
  recipeView.update(model.state.recipe);

  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render the recipe
    recipeView.render(model.state.recipe);

    //Display success message
    addRecipeView.renderMessage();

    //Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close the window form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('***', err);
    addRecipeView.renderError(err.message);
  }
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
