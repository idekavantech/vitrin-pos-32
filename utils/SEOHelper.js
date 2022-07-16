import { englishNumberToPersianNumber } from "./helper";

export const SEOAnalyser = ({
  seo_title: title = "",
  body = "",
  raw_body = "",
  business_url = "",
  keyphrase = "",
  slug = "",
  meta_description = "",
}) => {
  const situations_persian_title = {
    0: `بد`,
    1: `متوسط`,
    2: `خوب`,
  };
  const internalLinkAnalysis = () => {
    function urlify(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let internalLinks = 0;
      text.replace(urlRegex, function (url) {
        if (url && url.includes(business_url)) {
          internalLinks = 2;
        }
      });
      return internalLinks;
    }
    const score = urlify(raw_body);

    const descriptions = {
      0: `هیچ لینکی به صفحه‌های دیگر وبسایت وجود ندارد. سعی کنید لینک داخلی ایجاد کنید.`,
      1: `فقط [عدد] لینک به صفحه‌های دیگر وبسایت وجود دارد. لینک‌های داخلی بیشتری ایجاد کنید.`,
      2: ` [عدد] لینک به صفحه‌های دیگر وبسایت وجود دارد. عالیه!`,
    };

    return {
      title: "لینک داخلی",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  const outboundLinkAnalysis = () => {
    function urlify(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let outboundLinks = 0;
      text.replace(urlRegex, function (url) {
        if (url && !url.includes(business_url)) {
          outboundLinks = 2;
        }
      });
      return outboundLinks;
    }
    const score = urlify(raw_body);

    const descriptions = {
      0: `هیچ لینک خروجی در صفحه وجود ندارد. حداقل یک لینک خروجی در نوشته ایجاد کنید.`,
      1: ``,
      2: `لینک خروجی در صفحه وجود دارد. خیلی خوبه!`,
    };

    return {
      title: "لینک خارجی",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  const metaDescriptionLengthAnalysis = () => {
    let score = 0;
    const isBad = meta_description.length > 180 || meta_description.length < 50;
    const isNormal =
      meta_description.length < 180 && meta_description.length > 50;
    const isGood =
      meta_description.length > 110 && meta_description.length < 130;

    let badPersianText =
      isBad && meta_description.length < 50
        ? "خیلی کوتاه (کمتر از ۱۲۰ کاراکتر)"
        : "";
    badPersianText =
      isBad && meta_description.length > 180
        ? "خیلی بلند (بیشتر از۱۸۰ کاراکتر)"
        : badPersianText;
    badPersianText =
      isBad && meta_description.length === 0 ? "کاملا خالی" : badPersianText;

    let normalPersianText =
      isNormal && meta_description.length < 120
        ? "کم (۵۰ تا  ۱۲۰ کاراکتر)"
        : "";
    normalPersianText =
      isNormal && meta_description.length > 120
        ? "زیاد (۱۲۰ تا ۱۸۰ کاراکتر)"
        : normalPersianText;

    if (isGood) {
      score = 2;
    } else if (isNormal) {
      score = 1;
    }
    const descriptions = {
      0: `توضیحات متا ${badPersianText} است. توضیحات متا را بازنویسی کنید.`,
      1: `طول توضیحات متا ${normalPersianText} است. توضیحات متا را اصلاح کنید.`,
      2: `طول توضیحات متا به‌اندازه است. چقدر خوب!`,
    };
    return {
      title: "طول توضیحات متا",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  const keyphraseExistanceInSlug = () => {
    let score =
      slug && keyphrase && slug.replace(/-/g, " ").includes(keyphrase) ? 2 : 0;

    const descriptions = {
      0: `در اسلاگ از کلیدواژه استفاده نکرده‌اید. سعی کنید در اسلاگ از کلیدواژهٔ کانونی استفاده کنید.`,
      1: ``,
      2: `در اسلاگ از "${slug}" استفاده کرده‌اید. عالیه!`,
    };
    return {
      title: "وجود کلیدواژه در اسلاگ",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  const keyphraseExistanceInFirstParagraph = () => {
    let introParagraph = body.length > 120 ? body.substr(120) : body;
    const score =
      introParagraph && keyphrase && introParagraph.includes(keyphrase) ? 2 : 0;
    const descriptions = {
      0: `در مقدمهٔ متن، کلیدواژه به کار نرفته است. حتما در شروع متن از کلیدواژهٔ کانونی استفاده کنید.`,
      1: ``,
      2: ` در مقدمهٔ متن از کلیدواژه استفاده کرده‌اید. چقدر عالی!`,
    };
    return {
      title: "وجود کلیدواژه در مقدمه متن",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  const keyphraseLengthAnalysis = () => {
    let score = 0;
    const isBad = keyphrase.length > 40 || keyphrase.length < 4;
    const isNormal = keyphrase.length <= 40 && keyphrase.length >= 4;
    const isGood = keyphrase.length > 6 && keyphrase.length < 32;

    let badPersianText =
      isBad && keyphrase.length < 4 ? "خیلی کوتاه (کمتر از ۴ کاراکتر)" : "";
    badPersianText =
      isBad && keyphrase.length > 40
        ? "خیلی بلند (بیشتر ۴۰ کاراکتر)"
        : badPersianText;
    let normalPersianText =
      isNormal && keyphrase.length < 6 ? "کم (۴ تا  ۶ کاراکتر)" : "";
    normalPersianText =
      isNormal && keyphrase.length > 32
        ? "زیاد (۳۲ تا ۴۰ کاراکتر)"
        : normalPersianText;

    if (isGood) {
      score = 2;
    } else if (isNormal) {
      score = 1;
    }
    const descriptions = {
      0: `کلمه کانونی ${badPersianText} است. کلمه کانونی را بازنویسی کنید.`,
      1: `طول کلمه کانونی ${normalPersianText} است. کلمه کانونی را اصلاح کنید.`,
      2: `تعداد کاراکترهای کلیدواژهٔ انتخاب شده مناسب است. آفرین!`,
    };
    return {
      title: "طول کلمه کانونی",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  const keyphraseDensityAnalysis = () => {
    const regex = new RegExp(keyphrase, "g"); // same as inv.replace(/\b1x\b/g, "")
    const numberOfTitle = (body.match(regex) || []).length;
    const numberOfwords = body.split(" ").length;
    const density = (numberOfTitle / numberOfwords) * 100;

    let score = 0;
    const isBad = density > 3 || density < 0.5;
    const isNormal =
      (density < 1 && density > 0.5) || (density < 3 && density > 2);
    const isGood = density > 1 && density < 2;

    let badPersianText =
      isBad && density < 0.5 ? "خیلی کم (کمتر از نیم درصد)" : "";
    badPersianText =
      isBad && density > 3 ? "خیلی زیاد (بیشتر ۳ درصد)" : badPersianText;
    let normalPersianText =
      isNormal && density < 1 && density > 0.5 ? "کم (۰.۵ تا ۱ درصد)" : "";
    normalPersianText =
      isNormal && density < 3 && density > 2 ? "زیاد (۲ تا ۳ درصد)" : "";

    if (isGood) {
      score = 2;
    } else if (isNormal) {
      score = 1;
    }
    const descriptions = {
      0: `تراکم کلیدواژهٔ کانونی ${badPersianText} است. متن را بازنویسی کنید.`,
      1: `تراکم کلیدواژهٔ کانونی در متن ${normalPersianText} است. متن را طوری اصلاح کنید که کلیدواژه‌ها کم یا زیاد نباشد.`,
      2: `تراکم کلیدواژه‌ٔ کانونی در متن به‌اندازه (۱ تا ۲ درصد) است. خیلی خوبه!`,
    };
    return {
      title: "تراکم کلمه کانونی",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  const bodyLength = () => {
    let score = 0;
    const keys = body.split(" ").length;
    const isNormal = keys >= 200 && keys < 500;
    const isGood = keys >= 500;
    if (isGood) {
      score = 2;
    } else if (isNormal) {
      score = 1;
    }
    const descriptions = {
      0: `متن شما خیلی کوتاه ${englishNumberToPersianNumber(
        keys
      )} واژه (کمتر از ۲۰۰ واژه) است. متن طولانی‌تری بنویسید.`,
      1: `متن شما کوتاه (${englishNumberToPersianNumber(
        keys
      )} واژه) است. سعی کنید مقداری به متن بیافزایید.`,
      2: `متن شما ${englishNumberToPersianNumber(keys)} واژه دارد. چقدر عالی!`,
    };
    return {
      title: "تعداد کلمات متن",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };

  const existanceOfKeyphraseInTitle = () => {
    let score = 0;
    const isGood = title && keyphrase && title.includes(keyphrase);
    if (isGood) {
      score = 2;
    }
    const descriptions = {
      0: `در عنوان صفحه از کلیدواژهٔ کانونی استفاده نکرده‌اید. حتما در عنوان صفحه از کلیدواژه استفاده کنید.`,
      1: ``,
      2: `در عنوان صفحه از کلیدواژهٔ کانونی استفاده کرده‌اید. خوبه!`,
    };
    return {
      title: "وجود کلیدواژه در عنوان",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  const titleLength = () => {
    let score = 0;
    const chars = title.length;
    const isBad = chars < 30 || chars > 60;
    const isNormal = chars >= 30 && chars <= 60;
    const isGood = chars >= 40 && chars <= 50;
    if (isGood) {
      score = 2;
    } else if (isNormal) {
      score = 1;
    }

    const descriptions = {
      0: `عنوان سئو  ${
        chars < 30
          ? "خیلی کوتاه (کمتر از ۳۰ کاراکتر)"
          : chars > 60
          ? "خیلی بلند (بیشتر از ۶۰ کاراکتر)"
          : ""
      } است. عنوان سئو را بازنویسی کنید.`,
      1: `عنوان سئو ${
        chars > 50
          ? "زیاد (۵۰ تا ۶۰ کاراکتر)"
          : chars < 40
          ? "کوتاه (۳۰ تا ۴۰ کاراکتر)"
          : ""
      } است. سعی کنید عنوان سئوی ${
        chars > 50 ? "کوتاه‌تری" : chars < 40 ? "بلندتری" : ""
      } بنویسید.`,
      2: `طول عنوان سئو مناسب است. آفرین!`,
    };
    return {
      title: "طول عنوان سئو",
      description: descriptions[score],
      situation: situations_persian_title[score],
      score,
    };
  };
  let score = 0;
  const result = {
    internal_link: internalLinkAnalysis(),
    outbound_link: outboundLinkAnalysis(),
    meta_descripttion_length: metaDescriptionLengthAnalysis(),
    keyphrase_existance_in_slug: keyphraseExistanceInSlug(),
    keyphrase_existance_in_first_paragraph: keyphraseExistanceInFirstParagraph(),
    keyphrase_length: keyphraseLengthAnalysis(),
    keyphrase_density: keyphraseDensityAnalysis(),
    body_length: bodyLength(),
    keyphrase_existance_in_title: existanceOfKeyphraseInTitle(),
    title_length: titleLength(),
  };
  Object.keys(result).forEach((key) => {
    score += result[key].score;
  });
  result.score = score;
  if (result.score > 12) {
    result.score_description = "خوب";
  } else if (result.score >= 8) {
    result.score_description = "متوسط";
  } else if (result.score < 8) {
    result.score_description = "بد";
  }
  return result;
};
