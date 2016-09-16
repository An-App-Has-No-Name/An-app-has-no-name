'use strict';
export default function () {
  let categoriesList = [
    'General Knowledge',
    'Entertainment: Books',
    'Entertainment: Film',
    'Entertainment: Music',
    'Entertainment: Musicals & Theatres',
    'Entertainment: Television',
    'Entertainment: Video Games',
    'Entertainment: Board Games',
    'Entertainment: Japanese Anime & Manga',
    'Entertainment: Cartoon & Animations',
    'Science & Nature',
    'Science: Computers',
    'Science: Mathematics',
    'Mythology',
    'Sports',
    'Geography',
    'History',
    'Politics',
    'Art',
    'Celebrities',
    'Animals',
    'Vehicles',
    'Entertainment: Comics',
    'Science: Gadgets'
  ];

  function getRandomCategories(min, max) {

    let x = 0;



    let randomCat = [];

    while (x < 5) {
      let randomIndex = Math.floor(Math.random() * (max - min) + min);
      randomCat.push(categoriesList[randomIndex]);
      x += 1;
    }

    return randomCat;
  }

  return getRandomCategories(0, categoriesList.length);
}
