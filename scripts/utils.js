/**
 * Fetches the page index object.
 * @param {string} [prefix] Location of placeholders
 * @returns {object} Window placeholders object
 */
// eslint-disable-next-line import/prefer-default-export
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
          // error loading placeholders
          window.pageIndex[prefix] = {};
          resolve(window.pageIndex[prefix]);
        });
    });
  }
  return window.pageIndex[`${prefix}`];
}
