
/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * A map of custom parser names to imported parser functions.
 *
 * eg.
 * {
 *   myParser: customParser1,
 * }
 */
export const customParsers = {};

/**
 * An array of custom page elements to parse.
 * The name is the parser name.
 * If the element is a string, it will be used as a selector to the element to parse.
 * If the element is not provided, the parser will be applied to the main element.
 *
 * eg.
 * [
 *   { name: 'myParser', element: 'selector' },
 * ]
 */
export const customElements = [
  { name: 'categoryHero', element: '.category .header-page' },
  { name: 'categoryArticles', element: '.category .posts-container .masonry-container' },
  { name: 'hero', element: '.article-header' },
  { name: 'hero', element: '.header-page' },
  { name: 'customizedArticles', element: '.block-posts.customized-posts' },
  { name: 'categorySelect', element: '.category-list-mobile' },
  { name: 'socialsText', element: '.rs-social-block' },
  { name: 'articleTypeFilter', element: '.filters-post-type' },
  { name: 'pageMeta', element: '.promomat-container' },
];

/**
 * Custom transformers
 */
export const customTransformers = {
  inject: (hookName, element, { document }) => {
    if (hookName === 'beforePageTransform') {
      try {
        document.querySelector('#onetrust-consent-sdk')?.remove();
        document.querySelector('header')?.remove();
        document.querySelector('footer')?.remove();
        document.querySelector('.yellow-bar')?.remove();
        document.querySelector('.skip-link')?.remove();
        // the notification widget seen on the right side
        document.querySelector('.widgetRocheSEP')?.remove();
        document.querySelector('.yellow-bar')?.remove();
        document.querySelector('.skip-link screen-reader-text')?.remove();
        document.querySelector('.a11y-speak-intro-text')?.remove();
        document.querySelector('.comment-box')?.remove();
        document.querySelector('.return-block')?.remove();
        document.querySelector('.sidebar-article')?.remove();
        document.querySelector('.breadcrumbs-wrapper')?.remove();
        document.querySelector('.category .sidebar .category-list')?.remove();
        document.querySelectorAll('.block-posts.related-posts')?.forEach(element => {
          element.remove();
        });
      } catch (e) {
        console.warn('Failed to remove onetrust-consent-sdk', e);
      }
    }
  }
};
