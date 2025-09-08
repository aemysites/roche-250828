/**
 * Fetches the page index object.
 * @param {string} [prefix] Location of placeholders
 * @returns {object} Window placeholders object
 */
export async function fetchPageIndex(prefix = 'default') {
  window.pageIndex = window.pageIndex || {};
  if (!window.pageIndex[prefix]) {
    window.pageIndex[prefix] = new Promise((resolve) => {
      fetch(`${prefix === 'default' ? '' : prefix}/query-index.json`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return {};
        })
        .then((json) => {
          window.pageIndex[prefix] = json.data;
          resolve(window.pageIndex[prefix]);
        })
        .catch(() => {
          window.pageIndex[prefix] = {};
          resolve(window.pageIndex[prefix]);
        });
    });
  }
  return window.pageIndex[`${prefix}`];
}

/**
 * Fetches the categories object.
 * @param {string} [prefix] Location of placeholders
 * @returns {object} Window placeholders object
 */
export async function fetchCategories(prefix = 'default') {
  window.categories = window.categories || {};
  if (!window.categories[prefix]) {
    window.categories[prefix] = new Promise((resolve) => {
      fetch(`${prefix === 'default' ? '' : prefix}/categories.json`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return {};
        })
        .then((json) => {
          window.categories[prefix] = json.data;
          resolve(window.categories[prefix]);
        })
        .catch(() => {
          window.categories[prefix] = {};
          resolve(window.categories[prefix]);
        });
    });
  }
  return window.categories[`${prefix}`];
}
