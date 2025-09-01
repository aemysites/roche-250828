
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

export function heroParser(element, document) {
  let variant = 'default';
  if (element.classList.contains('header-home')) variant = 'home';
  if (element.classList.contains('article-header')) variant = 'article';
  if (element.classList.contains('header-page')) variant = 'page';

  const headline = element.querySelector('h1')?.textContent.trim() || '';
  const label = element.querySelector('.label-hp')?.textContent.trim() || '';
  const p = element.querySelector('p')?.textContent.trim() || '';
  const img = element.querySelector('img')?.getAttribute('src') || '';
  const graphic = element.querySelector('.graphic-line')?.innerHTML || '';

  return [
    [`Hero (${variant})`,  headline, label, p, img, graphic]
  ];
}

/**
 * A map of custom parser names to imported parser functions.
 *
 * eg.
 * {
 *   myParser: customParser1,
 * }
 */
export const customParsers = {
  heroVariant: heroParser,
};

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
  { name: 'heroVariant', element: '.header-home' },
  { name: 'heroVariant', element: '.article-header' },
  { name: 'heroVariant', element: '.header-page' },
];

/**
 * Custom transformers
 */
export const customTransformers = {};
