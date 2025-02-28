const {
  convertTimestampToDate,
  convertTopicsData,
  convertUsersData,
  convertArticlesData,
  convertCommentsData
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("convertTopicsData", () => {
  test("Does not mutate the input array of objects", () => {
    const input = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
        img_url: ""
      }
    ];

    const expected = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
        img_url: ""
      }
    ];

    convertTopicsData(input);

    expect(input).toEqual(expected);
  });

  test("Returns a new array", () => {
    const input = [{
      description: 'The man, the Mitch, the legend',
      slug: 'mitch',
      img_url: ""
    }];
    const actual = convertTopicsData(input);

    expect(actual).not.toBe(input);
  });

  test("Returns an empty array when passed an empty array", () => {
    expect(convertTopicsData([])).toEqual([]);
  });

  test("Returns an array of arrays with values formatted correctly", () => {
    const input = [
      { description: "The man, the Mitch, the legend", slug: "mitch", img_url: "" },
      { description: "Not dogs", slug: "cats", img_url: "" },
      { description: "what books are made of", slug: "paper", img_url: "" }
    ];

    const expectedOutput = [
      ["mitch", "The man, the Mitch, the legend", ""],
      ["cats", "Not dogs", ""],
      ["paper", "what books are made of", ""]
    ];

    expect(convertTopicsData(input)).toEqual(expectedOutput);
  });
});

describe("convertUsersData", () => {
  test("Does not mutate the input array of objects", () => {
    const input = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      }
    ];

    const expected = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      }
    ];

    convertUsersData(input);

    expect(input).toEqual(expected);
  });

  test("Returns a new array", () => {
    const input = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      }
    ];
    const actual = convertUsersData(input);

    expect(actual).not.toBe(input);
  });

  test("Returns an empty array when passed an empty array", () => {
    expect(convertUsersData([])).toEqual([]);
  });

  test("Returns an array of arrays with values formatted correctly", () => {
    const input = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
      {
        username: "rogersop",
        name: "paul",
        avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      }
    ];

    const expectedOutput = [
      ["butter_bridge", "jonny", "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"],
      ["icellusedkars", "sam", "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"],
      ["rogersop", "paul", "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"]
    ];

    expect(convertUsersData(input)).toEqual(expectedOutput);
  });
});

describe("convertArticlesData", () => {
  test("Does not mutate the input array of objects", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
    ];

    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
    ];

    convertArticlesData(input, convertTimestampToDate);

    expect(input).toEqual(expected);
  });

  test("Returns a new array", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
    ];
    const actual = convertArticlesData(input, convertTimestampToDate);

    expect(actual).not.toBe(input);
  });

  test("Returns an empty array when passed an empty array", () => {
    expect(convertArticlesData([], convertTimestampToDate)).toEqual([]);
  });

  test("Returns an array of arrays with values formatted correctly", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1602828180000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1604394720000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
    ];

    const expectedOutput = [
      [
        "Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date(1594329060000),
        100,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      ],
      [
        "Sony Vaio; or, The Laptop",
        "mitch",
        "icellusedkars",
        "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        new Date(1602828180000),
        undefined,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      ],
      [
        "Eight pug gifs that remind me of mitch",
        "mitch",
        "icellusedkars",
        "some gifs",
        new Date(1604394720000),
        undefined,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      ]
    ];

    expect(convertArticlesData(input, convertTimestampToDate)).toEqual(expectedOutput);
  });
});

describe("convertCommentsData", () => {
  const insertedArticles = [
    {
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1594329060000,
      votes: 100,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    },
    {
      article_id: 9,
      title: "They're not exactly dogs, are they?",
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'Well? Think about it.',
      created_at: 1591438200000,
      votes: null,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }
  ];

  test("Does not mutate the input array of objects", () => {
    const input = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      }
    ];

    const expected = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      }
    ];

    convertCommentsData(input, insertedArticles, convertTimestampToDate);

    expect(input).toEqual(expected);
  });

  test("Returns a new array", () => {
    const input = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      }
    ];
    const actual = convertCommentsData(input, insertedArticles, convertTimestampToDate);

    expect(actual).not.toBe(input);
  });

  test("Returns an empty array when passed an empty array", () => {
    expect(convertCommentsData([], insertedArticles, convertTimestampToDate)).toEqual([]);
  });

  test("Returns an array of arrays with values formatted correctly", () => {
    const input = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "Living in the shadow of a great man",
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        created_at: 1604113380000,
      },
      {
        article_title: "Living in the shadow of a great man",
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100,
        author: "icellusedkars",
        created_at: 1583025180000,
      }
    ];

    const expectedOutput = [
      [
        9,
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        16,
        "butter_bridge",
        new Date(1586179020000)
      ],
      [
        1,
        "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        14,
        "butter_bridge",
        new Date(1604113380000)
      ],
      [
        1,
        "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        100,
        "icellusedkars",
        new Date(1583025180000)
      ]
    ];

    expect(convertCommentsData(input, insertedArticles, convertTimestampToDate)).toEqual(expectedOutput);
  });
});