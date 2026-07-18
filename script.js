const tests = [
  {
    id: "natural",
    name: "I. Természetes számok",
    summary: "18 kérdés: kerekítés, hatványozás, műveletsorok, számkódok",
    icon: "natural-icon.png",
    length: 18,
    factories: [
      simplePowerQuestion,
      roundingQuestion,
      notSquareChoiceQuestion,
      lastDigitQuestion,
      gaussQuestion,
      multiplyByPowerOfTenQuestion,
      factoringChoiceQuestion,
      zeroPowerExpressionQuestion,
      complexNaturalExpressionQuestion,
      sameBasePowerQuestion,
      rewriteToBaseQuestion,
      smartAdditionQuestion,
      powerDefinitionQuestion,
      roundingRuleQuestion,
      largerSquareQuestion,
      placeValueQuestion,
      harderExpressionQuestion,
      notAbbNumberQuestion
    ]
  },
  {
    id: "divisibility",
    name: "II. Oszthatóság",
    summary: "17 kérdés: prímek, osztók, többszörösök, szöveges feladatok",
    icon: "divisibility-icon.png",
    length: 17,
    factories: [
      primeAmongFourQuestion,
      primeRuleQuestion,
      multipleRecognitionQuestion,
      divisorCountQuestion,
      divisorCountQuestion,
      primeSumProductQuestion,
      quotientRemainderQuestion,
      lcmQuestion,
      gcdQuestion,
      divisibleByTwoRuleQuestion,
      divisibleByNineRuleQuestion,
      smallestCodeDivisibleByNineQuestion,
      divisibleByThreeAndFiveQuestion,
      workerTextQuestion,
      priceTextQuestion,
      reverseThinkingQuestion,
      falseAssumptionQuestion
    ]
  },
  {
    id: "fractions",
    name: "III. Közönséges törtek",
    summary: "18 kérdés: valódi tört, áltört, bővítés, műveletek",
    icon: "fractions-icon.png",
    length: 18,
    factories: [
      primePartFractionQuestion,
      improperFractionChoiceQuestion,
      properFractionTheoryQuestion,
      betweenIntegersFractionQuestion,
      equivalentFractionQuestion,
      expansionTheoryQuestion,
      irreducibleTheoryQuestion,
      fractionAdditionChoiceQuestion,
      fractionAdditionChoiceQuestion,
      addSubtractWholeFractionQuestion,
      mixedToImproperQuestion,
      improperToMixedQuestion,
      fractionMultiplyNumeratorQuestion,
      reducibleFractionMultiplyDenominatorQuestion,
      fractionDivisionPartQuestion,
      fractionPowerChoiceQuestion,
      fractionExpressionQuestion,
      fractionExpressionQuestion
    ]
  },
  {
    id: "decimals",
    name: "IV. Tizedestörtek",
    summary: "22 kérdés: műveletek, kerekítés, szakaszos tizedestörtek",
    icon: "decimals-icon.png",
    length: 22,
    factories: [
      decimalAdditionQuestion,
      trickyDecimalAdditionQuestion,
      trickyDecimalSubtractionQuestion,
      decimalMultiplicationQuestion,
      decimalMultiplicationQuestion,
      decimalTimesIntegerQuestion,
      decimalBetweenChoiceQuestion,
      decimalOrderChoiceQuestion,
      repeatingDecimalDigitQuestion,
      fractionToDecimalQuestion,
      decimalDivideIntegerQuestion,
      finiteDecimalDivisionQuestion,
      finiteDecimalDivisionQuestion,
      repeatingDecimalDivisionQuestion,
      finiteDecimalToFractionChoiceQuestion,
      repeatingDecimalToFractionChoiceQuestion,
      decimalPlaceValueQuestion,
      decimalRoundingQuestion,
      fractionPartQuestion,
      decimalPriceQuestion,
      decimalExpressionQuestion,
      decimalExpressionQuestion
    ]
  },
  {
    id: "geometry",
    name: "V. Méréstan",
    summary: "17 kérdés: alapfogalmak, átváltások, kerület, terület, térfogat",
    icon: "geometry-icon.png",
    length: 17,
    factories: [
      geometryPointTheoryQuestion,
      geometryLineTheoryQuestion,
      geometryRayTheoryQuestion,
      geometrySegmentTheoryQuestion,
      geometryElementTheoryQuestion,
      geometryCollinearTheoryQuestion,
      geometryParallelTheoryQuestion,
      arithmeticMeanIntegerQuestion,
      arithmeticMeanDecimalQuestion,
      lengthConversionQuestion,
      lengthConversionQuestion,
      areaConversionQuestion,
      volumeConversionQuestion,
      rectanglePerimeterQuestion,
      rectangleAreaQuestion,
      mixedUnitRectangleQuestion,
      cuboidVolumeQuestion
    ]
  },
  {
    id: "summary",
    name: "Összefoglaló",
    summary: "25 véletlen kérdés az összes eddigi témából",
    icon: "summary-icon.svg",
    length: 25,
    factories: []
  }
];

const state = {
  selectedTest: "natural",
  run: [],
  index: 0,
  selectedChoice: null,
  active: false,
  progress: loadProgress()
};

const DAILY_PRACTICE_LIMIT_SECONDS = 60 * 60;
const MAX_ACTIVITY_GAP_SECONDS = 5 * 60;

const els = {
  studentName: document.querySelector("#studentName"),
  completedTests: document.querySelector("#completedTests"),
  bestRun: document.querySelector("#bestRun"),
  attempts: document.querySelector("#attempts"),
  testButtons: document.querySelector("#testButtons"),
  startBtn: document.querySelector("#startBtn"),
  restartBtn: document.querySelector("#restartBtn"),
  runProgress: document.querySelector("#runProgress"),
  testProgress: document.querySelector("#testProgress"),
  awardsList: document.querySelector("#awardsList"),
  awardDetails: document.querySelector("#awardDetails"),
  questionMeta: document.querySelector("#questionMeta"),
  questionText: document.querySelector("#questionText"),
  answerArea: document.querySelector("#answerArea"),
  feedback: document.querySelector("#feedback"),
  checkBtn: document.querySelector("#checkBtn"),
  hintBtn: document.querySelector("#hintBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  importBtn: document.querySelector("#importBtn"),
  importInput: document.querySelector("#importInput"),
  schoolCrestBtn: document.querySelector("#schoolCrestBtn")
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(items) {
  return items[rand(0, items.length - 1)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeInputQuestion({ html, answer, hint, testId }) {
  return {
    type: "input",
    html,
    answer: Number(answer),
    hint,
    testId,
    checker: (value) => Number(String(value).trim()) === Number(answer)
  };
}

function makeDecimalInputQuestion({ html, answer, hint, testId, tolerance = 0.000001 }) {
  const roundedAnswer = roundTo(Number(answer), 8);
  return {
    type: "input",
    html,
    answer: roundedAnswer,
    answerLabel: decimalText(roundedAnswer),
    hint,
    testId,
    checker: (value) => {
      const parsed = parseDecimalInput(value);
      return Number.isFinite(parsed) && Math.abs(parsed - roundedAnswer) <= tolerance;
    }
  };
}

function makeChoiceQuestion({ html, choices, answer, hint, testId }) {
  const normalizedChoices = choices.map((choice) => (
    typeof choice === "object"
      ? { label: String(choice.label), value: String(choice.value) }
      : { label: String(choice), value: String(choice) }
  ));
  const uniqueChoices = [];
  const seenValues = new Set();
  normalizedChoices.forEach((choice) => {
    if (seenValues.has(choice.value)) return;
    seenValues.add(choice.value);
    uniqueChoices.push(choice);
  });
  const answerValue = typeof answer === "object" ? String(answer.value) : String(answer);
  const answerLabel = uniqueChoices.find((choice) => choice.value === answerValue)?.label || answerValue;
  return { type: "choice", html, choices: uniqueChoices, answer: answerValue, answerLabel, hint, testId };
}

function powerLabel(base, exp) {
  return `<span class="math-power"><span class="power-base">${base}</span><span class="power-exp">${exp}</span></span>`;
}

function powerChoice(base, exp) {
  return { label: powerLabel(base, exp), value: `${base}^${exp}` };
}

function fractionPowerLabel(n, d, exp) {
  return powerLabel(`<span class="paren">(</span>${rawFractionLabel(n, d)}<span class="paren">)</span>`, exp);
}

function simplifyFraction(n, d) {
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return [(n / g) * sign, Math.abs(d / g)];
}

function fractionValue(n, d) {
  const [sn, sd] = simplifyFraction(n, d);
  return `${sn}/${sd}`;
}

function fractionLabel(n, d) {
  const [sn, sd] = simplifyFraction(n, d);
  if (sd === 1) return `<span class="math-integer">${sn}</span>`;
  return `<span class="math-frac"><span>${sn}</span><span>${sd}</span></span>`;
}

function rawFractionLabel(n, d) {
  return `<span class="math-frac"><span>${n}</span><span>${d}</span></span>`;
}

function fractionChoice(n, d) {
  return { label: fractionLabel(n, d), value: fractionValue(n, d) };
}

function fractionChoiceSet(correctN, correctD, wrongPairs) {
  const answer = fractionValue(correctN, correctD);
  const choices = [fractionChoice(correctN, correctD)];
  const seen = new Set([answer]);
  const addPair = ([n, d]) => {
    if (!d) return;
    const value = fractionValue(n, d);
    if (seen.has(value)) return;
    seen.add(value);
    choices.push(fractionChoice(n, d));
  };
  wrongPairs.forEach(addPair);
  for (let d = 2; choices.length < 4 && d <= 18; d += 1) {
    for (let n = 1; choices.length < 4 && n <= 24; n += 1) {
      addPair([n, d]);
    }
  }
  return choices.slice(0, 4);
}

function rawFractionChoice(n, d) {
  return { label: rawFractionLabel(n, d), value: fractionValue(n, d) };
}

function exactFractionChoice(n, d) {
  return { label: rawFractionLabel(n, d), value: `${n}/${d}` };
}

function roundTo(value, places = 2) {
  const factor = 10 ** places;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function decimalPlainText(value, places = 4) {
  if (typeof value === "string") return value.replace(".", ",");
  return Number(value)
    .toFixed(places)
    .replace(/0+$/, "")
    .replace(/\.$/, "")
    .replace(".", ",");
}

function decimalText(value, places = 4) {
  return `<span class="decimal-number">${decimalPlainText(value, places)}</span>`;
}

function decimalChoice(value, places = 4) {
  return { label: decimalText(value, places), value: decimalPlainText(value, places) };
}

function parseDecimalInput(value) {
  return Number(String(value).trim().replace(",", "."));
}

function decimalFractionLabel(text) {
  return decimalText(text);
}

function mixedLabel(whole, n, d) {
  return `<span class="mixed-number"><span>${whole}</span>${rawFractionLabel(n, d)}</span>`;
}

function simplePowerQuestion(testId) {
  const base = rand(2, 9);
  const exp = rand(2, 4);
  return makeInputQuestion({
    testId,
    html: `${powerLabel(base, exp)} =`,
    answer: base ** exp,
    hint: `${exp} darab ${base}-t kell összeszorozni.`
  });
}

function roundingQuestion(testId) {
  const number = rand(1200, 9876);
  const place = pick([
    { name: "tízesre", value: 10 },
    { name: "százasra", value: 100 },
    { name: "ezresre", value: 1000 }
  ]);
  return makeInputQuestion({
    testId,
    html: `Kerekítsd a ${number} számot ${place.name}!`,
    answer: Math.round(number / place.value) * place.value,
    hint: "0, 1, 2, 3, 4 esetén lefelé, 5, 6, 7, 8, 9 esetén felfelé kerekítünk."
  });
}

function notSquareChoiceQuestion(testId) {
  const squares = shuffle([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]);
  const notSquares = [12, 18, 20, 27, 32, 45, 50, 63, 72, 80];
  const answer = pick(notSquares);
  return makeChoiceQuestion({
    testId,
    html: "Jelöld be, hogy melyik NEM négyzetszám!",
    choices: shuffle([answer, ...squares.slice(0, 3)]).map(String),
    answer: String(answer),
    hint: "A négyzetszám olyan szám, amely felírható n · n alakban."
  });
}

function lastDigitQuestion(testId) {
  const cycles = {
    2: [2, 4, 8, 6],
    3: [3, 9, 7, 1],
    4: [4, 6],
    5: [5],
    7: [7, 9, 3, 1],
    9: [9, 1]
  };
  const base = Number(pick(Object.keys(cycles)));
  const exp = rand(18, 75);
  const cycle = cycles[base];
  return makeInputQuestion({
    testId,
    html: `Mi lesz a ${powerLabel(base, exp)} utolsó számjegye?`,
    answer: cycle[(exp - 1) % cycle.length],
    hint: "Az utolsó számjegyek ismétlődő ciklust alkotnak."
  });
}

function gaussQuestion(testId) {
  const n = pick([20, 30, 40, 50, 75, 100]);
  return makeInputQuestion({
    testId,
    html: `Számold ki:<br>1 + 2 + 3 + ... + ${n} =`,
    answer: (n * (n + 1)) / 2,
    hint: "Gauss-módszer: n · (n + 1) : 2."
  });
}

function multiplyByPowerOfTenQuestion(testId) {
  const n = rand(12, 987);
  const exp = rand(1, 4);
  return makeInputQuestion({
    testId,
    html: `${n} · ${powerLabel(10, exp)} =`,
    answer: n * (10 ** exp),
    hint: `10<sup>${exp}</sup>-nel szorozva ${exp} nullát írunk a szám végére.`
  });
}

function factoringChoiceQuestion(testId) {
  const factor = rand(12, 90);
  const a = rand(10, 45);
  const b = 100 - a;
  const answer = `${factor} · (${a} + ${b})`;
  return makeChoiceQuestion({
    testId,
    html: `Melyik a helyes kiemelés?<br>${a} · ${factor} + ${b} · ${factor}`,
    choices: shuffle([
      answer,
      `${factor + 1} · (${a} + ${b})`,
      `${factor} · (${a} + ${b + 1})`,
      `${factor} · (${a} · ${b})`
    ]),
    answer,
    hint: `A közös tényező a ${factor}.`
  });
}

function zeroPowerExpressionQuestion(testId) {
  const a = rand(2, 7);
  const b = rand(2, 5);
  const c = rand(2, 7);
  const answer = a + b * ((c ** 2) - 1);
  return makeInputQuestion({
    testId,
    html: `${a} + ${b} · (${powerLabel(c, 2)} - ${powerLabel(9, 0)}) =`,
    answer,
    hint: "Először a zárójel és a hatványok: 9⁰ = 1."
  });
}

function complexNaturalExpressionQuestion(testId) {
  const base = rand(2, 5);
  const multiplier = rand(2, 6);
  const divisor = pick([2, 3, 4, 5]);
  const quotientPart = rand(Math.ceil((base ** 2 + 1) / divisor), 14);
  const inside = divisor * quotientPart - (base ** 2);
  const add = rand(1, 12);
  const answer = quotientPart * multiplier + add;
  return makeInputQuestion({
    testId,
    html: `[(${powerLabel(base, 2)} + ${inside}) · ${multiplier}] : ${divisor} + ${add} =`,
    answer,
    hint: "Sorrend: zárójel, hatványozás, szorzás/osztás, összeadás."
  });
}

function harderExpressionQuestion(testId) {
  const a = rand(2, 5);
  const b = rand(2, 6);
  const c = rand(2, 5);
  const d = rand(2, 4);
  const e = rand(3, 9);
  const multiplier = rand(2, 5);
  const divisor = pick([2, 3, 4]);
  const minForInside = Math.ceil((a ** 2 + b * c + 1) / divisor);
  const minForPositive = Math.ceil(((d ** 2) - e + 1) / multiplier);
  const quotientPart = rand(Math.max(minForInside, minForPositive, 3), 18);
  const inside = divisor * quotientPart - (a ** 2 + b * c);
  const answer = quotientPart * multiplier - (d ** 2) + e;
  return makeInputQuestion({
    testId,
    html: `{[${powerLabel(a, 2)} + ${b} · ${c} + ${inside}] · ${multiplier}} : ${divisor} - ${powerLabel(d, 2)} + ${e} =`,
    answer,
    hint: "Haladj lépésenként: zárójel, hatványozás, szorzás/osztás, majd összeadás és kivonás."
  });
}

function sameBasePowerQuestion(testId) {
  const base = rand(2, 7);
  const a = rand(4, 8);
  const b = rand(1, 3);
  const isProduct = Math.random() > 0.5;
  const answerExp = isProduct ? a + b : a - b;
  const wrongExps = [a + b + 1, Math.max(1, a - b - 1), a * b, answerExp + 2]
    .filter((exp, index, list) => exp !== answerExp && list.indexOf(exp) === index)
    .slice(0, 2);
  return makeChoiceQuestion({
    testId,
    html: `<span class="task-label">Válaszd ki az egyetlen hatvány alakot!</span>
      <span class="math-line">${powerLabel(base, a)} ${isProduct ? "·" : ":"} ${powerLabel(base, b)}</span>`,
    choices: shuffle([
      powerChoice(base, answerExp),
      ...wrongExps.map((exp) => powerChoice(base, exp)),
      powerChoice(base ** 2, answerExp)
    ]),
    answer: `${base}^${answerExp}`,
    hint: isProduct
      ? "Azonos alapú hatványok szorzásánál a kitevőket összeadjuk."
      : "Azonos alapú hatványok osztásánál a kitevőket kivonjuk."
  });
}

function rewriteToBaseQuestion(testId) {
  const item = pick([
    { base: 8, exp: 5, target: 2, answerExp: 15, wrong: [[2, 8], [4, 5], [2, 10]] },
    { base: 16, exp: 3, target: 2, answerExp: 12, wrong: [[2, 9], [4, 6], [2, 6]] },
    { base: 27, exp: 2, target: 3, answerExp: 6, wrong: [[3, 4], [9, 2], [3, 9]] },
    { base: 25, exp: 3, target: 5, answerExp: 6, wrong: [[5, 3], [10, 3], [5, 9]] }
  ]);
  return makeChoiceQuestion({
    testId,
    html: `<span class="task-label">Írd ${item.target}-es alapú hatványként!</span>
      <span class="math-line">${powerLabel(item.base, item.exp)}</span>`,
    choices: shuffle([powerChoice(item.target, item.answerExp), ...item.wrong.map(([base, exp]) => powerChoice(base, exp))]),
    answer: `${item.target}^${item.answerExp}`,
    hint: "Először írd át az alapot hatványként, majd szorozd a kitevőket."
  });
}

function smartAdditionQuestion(testId) {
  const a = rand(20, 79);
  const c = 100 - a;
  const b = rand(20, 69);
  const d = 100 - b;
  const extra = pick([4, 5, 8, 10, 15]);
  return makeInputQuestion({
    testId,
    html: `${a} + ${b} + ${c} + ${extra} + ${d} =`,
    answer: 200 + extra,
    hint: `Keresd a 100-at adó párokat: ${a}+${c} és ${b}+${d}.`
  });
}

function powerDefinitionQuestion(testId) {
  return makeChoiceQuestion({
    testId,
    html: `Mit jelent az ${powerLabel("a", "n")} jelölés természetes kitevőnél?`,
    choices: shuffle([
      "az a szám n-szeri szorzata",
      "az a és n összege",
      "az a szám n-nel osztva",
      "mindig páros szám"
    ]),
    answer: "az a szám n-szeri szorzata",
    hint: "Például 3⁴ = 3 · 3 · 3 · 3."
  });
}

function roundingRuleQuestion(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Melyik állítás igaz a kerekítésre?",
    choices: shuffle([
      "0, 1, 2, 3, 4 esetén lefelé, 5, 6, 7, 8, 9 esetén felfelé kerekítünk",
      "mindig lefelé kerekítünk",
      "csak a 9-es számjegynél kerekítünk felfelé",
      "a kerekítés nem változtathatja meg a számot"
    ]),
    answer: "0, 1, 2, 3, 4 esetén lefelé, 5, 6, 7, 8, 9 esetén felfelé kerekítünk",
    hint: "Az 5 már felfelé kerekít."
  });
}

function largerSquareQuestion(testId) {
  const n = rand(11, 25);
  return makeInputQuestion({
    testId,
    html: `${powerLabel(n, 2)} =`,
    answer: n ** 2,
    hint: `${n}<sup>2</sup> = ${n} · ${n}.`
  });
}

function placeValueQuestion(testId) {
  const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6);
  if (digits[0] === 0) {
    const swapIndex = digits.findIndex((digit) => digit !== 0);
    [digits[0], digits[swapIndex]] = [digits[swapIndex], digits[0]];
  }
  const number = Number(digits.join(""));
  const places = ["százezresek", "tízezresek", "ezresek", "százasok", "tízesek", "egyesek"];
  const i = rand(0, 5);
  return makeChoiceQuestion({
    testId,
    html: `A ${number.toLocaleString("hu-HU")} számban milyen helyiértéken áll a(z) ${digits[i]}?`,
    choices: shuffle([places[i], ...shuffle(places.filter((_, idx) => idx !== i)).slice(0, 3)]),
    answer: places[i],
    hint: "Balról jobbra: százezres, tízezres, ezres, százas, tízes, egyes."
  });
}

function overline(text) {
  return `<span class="overline">${text}</span>`;
}

function abbNumber(a, b) {
  return 100 * a + 10 * b + b;
}

function notAbbNumberQuestion(testId) {
  const allSameDigit = rand(1, 9);
  const allSame = 111 * allSameDigit;
  const correctSet = new Set([allSame]);
  while (correctSet.size < 3) {
    correctSet.add(abbNumber(rand(1, 9), rand(0, 9)));
  }
  let answer = rand(100, 999);
  while (String(answer)[1] === String(answer)[2] || correctSet.has(answer)) {
    answer = rand(100, 999);
  }
  return makeChoiceQuestion({
    testId,
    html: `Melyik szám NEM <span class="code-gap">${overline("abb")}</span> alakú?`,
    choices: shuffle([answer, ...correctSet]).map(String),
    answer: String(answer),
    hint: `${overline("abb")} alakban az utolsó két számjegy azonos. A 777 is megfelel, mert az utolsó két számjegye azonos.`
  });
}

function listPowersQuestion(testId) {
  const base = pick([2, 3, 4, 5]);
  const count = rand(4, 6);
  const values = Array.from({ length: count }, (_, i) => base ** (i + 1));
  return makeChoiceQuestion({
    testId,
    html: `Melyik sorolja fel helyesen a ${base} első ${count} hatványát?`,
    choices: shuffle([
      values.join(", "),
      values.map((value) => value + base).join(", "),
      Array.from({ length: count }, (_, i) => base * (i + 1)).join(", "),
      values.slice(0, -1).concat(values.at(-1) + 1).join(", ")
    ]),
    answer: values.join(", "),
    hint: "Mindig az előző értéket szorozzuk az alappal."
  });
}

function productAsPowerChoice(testId) {
  const base = rand(2, 9);
  const factors = rand(3, 5);
  const product = Array.from({ length: factors }, () => base).join(" · ");
  const answer = `${base}^${factors}`;
  const choices = [powerChoice(base, factors)];
  const seen = new Set([answer]);
  [powerChoice(factors, base), powerChoice(base * factors, 2), powerChoice(base, factors + 1), powerChoice(base + 1, factors)]
    .forEach((choice) => {
      if (seen.has(choice.value) || choices.length >= 4) return;
      seen.add(choice.value);
      choices.push(choice);
    });
  return makeChoiceQuestion({
    testId,
    html: `<span class="task-label">Írd egyetlen hatvány alakjába!</span>
      <span class="math-line">${product}</span>`,
    choices: shuffle(choices),
    answer,
    hint: "Az alap az ismétlődő tényező, a kitevő a tényezők száma."
  });
}

function zeroPowerTheory(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Melyik állítás igaz?",
    choices: shuffle([
      { label: `${powerLabel("a", 0)} = 1, ha a nem 0`, value: "a^0=1" },
      { label: `${powerLabel(0, 0)} értéke 0`, value: "0^0=0" },
      { label: `${powerLabel(1, "n")} = n`, value: "1^n=n" },
      { label: `${powerLabel("a", 1)} = 1`, value: "a^1=1" }
    ]),
    answer: "a^0=1",
    hint: "A nulladik hatvány értéke 1, de 0⁰ nem értelmezett."
  });
}

function sameBaseRuleTheory(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Azonos alapú hatványok szorzásánál mit teszünk a kitevőkkel?",
    choices: shuffle(["összeadjuk", "kivonjuk", "összeszorozzuk", "változatlanul hagyjuk"]),
    answer: "összeadjuk",
    hint: "Azonos alapnál szorzáskor a kitevőket összeadjuk."
  });
}

function quotientAsPowerChoice(testId) {
  const base = rand(2, 9);
  const a = rand(5, 9);
  const b = rand(1, 4);
  const answerExp = a - b;
  const wrongExps = [a + b, a * b, Math.max(1, b - a), answerExp + 1, answerExp + 2]
    .filter((exp, index, list) => exp !== answerExp && list.indexOf(exp) === index)
    .slice(0, 3);
  return makeChoiceQuestion({
    testId,
    html: `<span class="task-label">Írd egyetlen hatvány alakjába!</span>
      <span class="math-line">${powerLabel(base, a)} : ${powerLabel(base, b)}</span>`,
    choices: shuffle([
      powerChoice(base, answerExp),
      ...wrongExps.map((exp) => powerChoice(base, exp))
    ]),
    answer: `${base}^${answerExp}`,
    hint: "Azonos alapú hatványok osztásánál a kitevőket kivonjuk."
  });
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i += 1) {
    if (n % i === 0) return false;
  }
  return true;
}

function divisorCount(n) {
  let count = 0;
  for (let i = 1; i <= n; i += 1) {
    if (n % i === 0) count += 1;
  }
  return count;
}

function primeAmongFourQuestion(testId) {
  const prime = pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]);
  const composites = shuffle([12, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57]);
  return makeChoiceQuestion({
    testId,
    html: "Jelöld be, melyik szám prímszám!",
    choices: shuffle([prime, ...composites.slice(0, 3)]).map(String),
    answer: String(prime),
    hint: "A prímszámnak pontosan két természetes osztója van: 1 és önmaga."
  });
}

function primeRuleQuestion(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Mikor prímszám egy természetes szám?",
    choices: shuffle([
      "ha pontosan két természetes osztója van: 1 és önmaga",
      "ha páros",
      "ha legalább három osztója van",
      "ha osztható 3-mal"
    ]),
    answer: "ha pontosan két természetes osztója van: 1 és önmaga",
    hint: "Az 1 nem prímszám, mert nincs pontosan két természetes osztója."
  });
}

function multipleRecognitionQuestion(testId) {
  const base = pick([4, 6, 7, 8, 9, 12]);
  const correct = Array.from({ length: 4 }, () => base * rand(2, 12));
  const wrong = correct.map((value, index) => index === 0 ? value + 1 : value);
  return makeChoiceQuestion({
    testId,
    html: `Melyik sorban szerepelnek csak a ${base} többszörösei?`,
    choices: shuffle([
      correct.join(", "),
      wrong.join(", "),
      correct.map((value) => value + base - 1).join(", "),
      [base + 2, base * 2, base * 3, base * 4].join(", ")
    ]),
    answer: correct.join(", "),
    hint: `A ${base} többszörösei oszthatók ${base}-val.`
  });
}

function divisorCountQuestion(testId) {
  const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 48, 54, 60]);
  return makeInputQuestion({
    testId,
    html: `Hány természetes osztója van a ${n} számnak?`,
    answer: divisorCount(n),
    hint: "Írd fel osztópárokban: 1 és maga a szám, majd 2, 3, 4..."
  });
}

function primeSumProductQuestion(testId) {
  const [a, b] = pick([[2, 5], [3, 7], [5, 11], [7, 13], [11, 17], [13, 19]]);
  return makeInputQuestion({
    testId,
    html: `Két prímszám szorzata ${a * b}. Mennyi ennek a két prímszámnak az összege?`,
    answer: a + b,
    hint: `Bontsd a ${a * b} számot két prímtényezőre, majd add össze őket.`
  });
}

function quotientRemainderQuestion(testId) {
  const divisor = rand(5, 12);
  const quotient = rand(4, 11);
  const remainder = rand(1, divisor - 1);
  return makeInputQuestion({
    testId,
    html: `Határozd meg azt a számot, amit ha elosztunk ${divisor}-val, a hányados ${quotient}, a maradék ${remainder}.`,
    answer: divisor * quotient + remainder,
    hint: "A keresett szám = osztó · hányados + maradék."
  });
}

function lcmQuestion(testId) {
  let a = rand(10, 60);
  let b = rand(10, 60);
  while (lcm(a, b) >= 200) {
    a = rand(10, 60);
    b = rand(10, 60);
  }
  return makeInputQuestion({
    testId,
    html: `Mennyi a ${a} és ${b} legkisebb közös többszöröse?`,
    answer: lcm(a, b),
    hint: "Keress olyan legkisebb számot, amely mindkét számmal osztható."
  });
}

function gcdQuestion(testId) {
  let a = rand(10, 60);
  let b = rand(10, 60);
  while (gcd(a, b) === 1) {
    a = rand(10, 60);
    b = rand(10, 60);
  }
  return makeInputQuestion({
    testId,
    html: `Mennyi a ${a} és ${b} legnagyobb közös osztója?`,
    answer: gcd(a, b),
    hint: "A legnagyobb olyan számot keresd, amely mindkét számot osztja."
  });
}

function divisibleByTwoRuleQuestion(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Mikor osztható egy szám 2-vel?",
    choices: shuffle([
      "ha az utolsó számjegye páros",
      "ha a számjegyeinek összege páros",
      "ha az első számjegye páros",
      "ha 2-nél nagyobb"
    ]),
    answer: "ha az utolsó számjegye páros",
    hint: "A 2-vel való oszthatóságnál az utolsó számjegyet figyeljük."
  });
}

function divisibleByNineRuleQuestion(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Mikor osztható egy szám 9-cel?",
    choices: shuffle([
      "ha a számjegyeinek összege osztható 9-cel",
      "ha az utolsó számjegye 9",
      "ha páros",
      "ha a számjegyeinek összege osztható 3-mal"
    ]),
    answer: "ha a számjegyeinek összege osztható 9-cel",
    hint: "9-cel való oszthatóságnál a számjegyek összegét vizsgáljuk."
  });
}

function smallestCodeDivisibleByNineQuestion(testId) {
  const patterns = [
    {
      label: overline("abb"),
      value: () => {
        for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) {
          const n = 100 * a + 11 * b;
          if (n % 9 === 0) return n;
        }
        return 0;
      }
    },
    {
      label: overline("aab"),
      value: () => {
        for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) {
          const n = 110 * a + b;
          if (n % 9 === 0) return n;
        }
        return 0;
      }
    }
  ];
  const pattern = pick(patterns);
  return makeInputQuestion({
    testId,
    html: `Melyik a legkisebb ${pattern.label} alakú szám, amely osztható 9-cel?`,
    answer: pattern.value(),
    hint: "A 9-cel való oszthatósághoz a számjegyek összege legyen 9 többszöröse."
  });
}

function divisibleByThreeAndFiveQuestion(testId) {
  const answer = 15 * rand(100, 999);
  const wrongs = [
    answer + 5,
    answer + 3,
    answer + 1
  ].map((n) => n + (n % 15 === 0 ? 1 : 0));
  return makeChoiceQuestion({
    testId,
    html: "Melyik szám osztható 3-mal és 5-tel is?",
    choices: shuffle([answer, ...wrongs]).map(String),
    answer: String(answer),
    hint: "3-mal a számjegyek összege alapján, 5-tel 0 vagy 5 végződés alapján döntünk."
  });
}

function workerTextQuestion(testId) {
  const workers = rand(3, 10);
  const days = rand(3, 9);
  return makeInputQuestion({
    testId,
    html: `Ha ${workers} munkás ${days} nap alatt végez el egy munkát, akkor 1 munkás hány nap alatt végezné el ugyanazt a munkát?`,
    answer: workers * days,
    hint: "Ugyanaz a munka: kevesebb munkásnak arányosan több idő kell."
  });
}

function priceTextQuestion(testId) {
  const kg = rand(3, 12);
  const unit = rand(2, 9);
  const price = kg * unit;
  const asked = rand(2, 9);
  return makeInputQuestion({
    testId,
    html: `Ha ${kg} kg banán ${price} lej, mennyibe kerül ${asked} kg banán?`,
    answer: asked * unit,
    hint: "Először számold ki 1 kg árát."
  });
}

function reverseThinkingQuestion(testId) {
  let start = 0;
  let multiply = 0;
  let add = 0;
  let subtract = 0;
  let divisor = 0;
  let result = 0;
  do {
    start = rand(3, 20);
    multiply = rand(2, 5);
    add = rand(3, 12);
    subtract = rand(1, add + 2);
    divisor = rand(2, 5);
    result = (start * multiply + add - subtract) / divisor;
  } while (!Number.isInteger(result));
  return makeInputQuestion({
    testId,
    html: `Gondoltam egy számra, megszoroztam a(z) ${multiply} számmal, hozzáadtam a(z) ${add} számot, levontam a(z) ${subtract} számot, elosztottam a(z) ${divisor} számmal, és a(z) ${result} számot kaptam. Melyik számra gondoltam?`,
    answer: start,
    hint: "Indulj visszafelé: szorozz, adj hozzá vagy vonj ki fordított sorrendben."
  });
}

function falseAssumptionQuestion(testId) {
  const rabbits = rand(3, 15);
  const chickens = rand(3, 15);
  const heads = rabbits + chickens;
  const legs = rabbits * 4 + chickens * 2;
  return makeInputQuestion({
    testId,
    html: `Egy farmon tyúkok és nyulak vannak. Összesen ${heads} fejük és ${legs} lábuk van. Hány nyúl van a farmon?`,
    answer: rabbits,
    hint: "Ha minden állat tyúk lenne, 2 lába lenne. A többletlábak kettesével adnak egy nyulat."
  });
}

function primePartFractionQuestion(testId) {
  const askNumerator = Math.random() > 0.5;
  const primeValues = [2, 3, 5, 7, 11];
  const compositeValues = [4, 6, 8, 9, 10, 12, 14, 15];
  const candidates = [];
  const seen = new Set();

  for (const numerator of [...primeValues, ...compositeValues]) {
    for (const denominator of [...primeValues, ...compositeValues]) {
      if (numerator === denominator || numerator % denominator === 0) continue;
      const value = `${numerator}/${denominator}`;
      if (seen.has(value)) continue;
      seen.add(value);
      candidates.push([numerator, denominator]);
    }
  }

  const isCorrectPair = ([numerator, denominator]) => askNumerator ? isPrime(numerator) : isPrime(denominator);
  const correct = pick(candidates.filter(isCorrectPair));
  const wrongs = shuffle(candidates.filter((pair) => !isCorrectPair(pair))).slice(0, 3);
  const options = shuffle([correct, ...wrongs]);
  return makeChoiceQuestion({
    testId,
    html: `Melyik tört ${askNumerator ? "számlálója" : "nevezője"} prímszám?`,
    choices: options.map(([n, d]) => exactFractionChoice(n, d)),
    answer: `${correct[0]}/${correct[1]}`,
    hint: "A prímszámnak pontosan két természetes osztója van: 1 és önmaga."
  });
}

function improperFractionChoiceQuestion(testId) {
  const correct = [rand(5, 12), rand(2, 5)];
  while (correct[0] <= correct[1] || correct[0] % correct[1] === 0) {
    correct[0] = rand(5, 12);
    correct[1] = rand(2, 5);
  }
  const proper = [[1, 3], [2, 5], [3, 8], [4, 9], [5, 11]];
  return makeChoiceQuestion({
    testId,
    html: "Melyik tört áltört?",
    choices: shuffle([correct, ...shuffle(proper).slice(0, 3)]).map(([n, d]) => rawFractionChoice(n, d)),
    answer: fractionValue(correct[0], correct[1]),
    hint: "Ebben a feladatban olyan áltörtet keresünk, amelynek számlálója nagyobb a nevezőjénél."
  });
}

function properFractionTheoryQuestion(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Mit jelent az, hogy egy tört valódi tört?",
    choices: shuffle([
      "a számláló kisebb, mint a nevező",
      "a számláló nagyobb, mint a nevező",
      "a nevező mindig 1",
      "a tört értéke egész szám"
    ]),
    answer: "a számláló kisebb, mint a nevező",
    hint: "Valódi törtnél a tört értéke 1-nél kisebb."
  });
}

function betweenIntegersFractionQuestion(testId) {
  const d = rand(2, 9);
  const whole = rand(1, 6);
  const n = whole * d + rand(1, d - 1);
  return makeChoiceQuestion({
    testId,
    html: `Melyik két természetes szám között van ez a tört?<span class="math-line">${rawFractionLabel(n, d)}</span>`,
    choices: shuffle([
      `${whole} és ${whole + 1}`,
      `${whole - 1} és ${whole}`,
      `${whole + 1} és ${whole + 2}`,
      `${whole + 2} és ${whole + 3}`
    ]),
    answer: `${whole} és ${whole + 1}`,
    hint: "Oszd el a számlálót a nevezővel: a hányados mutatja az egészrészt."
  });
}

function equivalentFractionQuestion(testId) {
  const n = rand(1, 5);
  const d = rand(n + 1, 10);
  const k = rand(2, 5);
  const correct = [n * k, d * k];
  return makeChoiceQuestion({
    testId,
    html: `Melyik tört egyenlő ezzel: ${rawFractionLabel(n, d)} ?`,
    choices: shuffle(fractionChoiceSet(correct[0], correct[1], [
      [n + k, d + k],
      [n * k, d],
      [n, d * k],
      [n + 1, d + k + 1],
      [n * k + 1, d * k]
    ])),
    answer: fractionValue(correct[0], correct[1]),
    hint: "Ekvivalens törtnél a számlálót és a nevezőt ugyanazzal a számmal szorozzuk vagy osztjuk."
  });
}

function expansionTheoryQuestion(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Mit jelent egy tört bővítése?",
    choices: shuffle([
      "a számlálót és a nevezőt ugyanazzal a nem nulla számmal megszorozzuk",
      "csak a számlálót szorozzuk meg",
      "csak a nevezőt szorozzuk meg",
      "a számlálóból és nevezőből ugyanannyit kivonunk"
    ]),
    answer: "a számlálót és a nevezőt ugyanazzal a nem nulla számmal megszorozzuk",
    hint: "Bővítéskor a tört értéke nem változik."
  });
}

function irreducibleTheoryQuestion(testId) {
  return makeChoiceQuestion({
    testId,
    html: "Mit jelent az, hogy egy tört irreducibilis?",
    choices: shuffle([
      "nem lehet már tovább egyszerűsíteni",
      "a számláló nagyobb, mint a nevező",
      "csak páros számokból áll",
      "mindig egész szám"
    ]),
    answer: "nem lehet már tovább egyszerűsíteni",
    hint: "A számlálónak és nevezőnek nincs 1-nél nagyobb közös osztója."
  });
}

function fractionAdditionChoiceQuestion(testId) {
  const d1 = rand(2, 12);
  let d2 = rand(2, 12);
  while (d2 === d1) d2 = rand(2, 12);
  const n1 = rand(1, d1 - 1);
  const n2 = rand(1, d2 - 1);
  const den = lcm(d1, d2);
  const num = n1 * (den / d1) + n2 * (den / d2);
  return makeChoiceQuestion({
    testId,
    html: `${rawFractionLabel(n1, d1)} + ${rawFractionLabel(n2, d2)} =`,
    choices: shuffle([
      fractionChoice(num, den),
      fractionChoice(n1 + n2, d1 + d2),
      fractionChoice(n1 + n2, den),
      fractionChoice(num + 1, den)
    ]),
    answer: fractionValue(num, den),
    hint: "Hozd közös nevezőre, utána add össze a számlálókat."
  });
}

function addSubtractWholeFractionQuestion(testId) {
  let d1 = rand(2, 10);
  let d2 = rand(2, 12);
  let whole = 1;
  let n1 = rand(1, d1 - 1);
  let n2 = rand(1, d2 - 1);
  let den = lcm(d1, d2);
  let num = n1 * (den / d1) + n2 * (den / d2) - whole * den;
  while (d2 === d1 || num <= 0) {
    d1 = rand(2, 10);
    d2 = rand(2, 12);
    n1 = rand(1, d1 - 1);
    n2 = rand(1, d2 - 1);
    den = lcm(d1, d2);
    num = n1 * (den / d1) + n2 * (den / d2) - whole * den;
  }
  return makeChoiceQuestion({
    testId,
    html: `${rawFractionLabel(n1, d1)} + ${rawFractionLabel(n2, d2)} - ${whole} =`,
    choices: shuffle(fractionChoiceSet(num, den, [
      [n1 + n2 - whole, den],
      [num + den, den],
      [num + 1, den],
      [num + 2, den + 1]
    ])),
    answer: fractionValue(num, den),
    hint: "Az egész számot is írd közös nevezőjű tört alakba."
  });
}

function mixedToImproperQuestion(testId) {
  const whole = rand(1, 5);
  const d = rand(3, 9);
  const n = rand(1, d - 1);
  const resultN = whole * d + n;
  return makeChoiceQuestion({
    testId,
    html: `Írd közönséges tört alakba: ${mixedLabel(whole, n, d)}`,
    choices: shuffle(fractionChoiceSet(resultN, d, [
      [whole + n, d],
      [resultN, whole],
      [n, whole * d],
      [resultN + 1, d]
    ])),
    answer: fractionValue(resultN, d),
    hint: "Az egészeket nevezőnyi részekre bontjuk, majd hozzáadjuk a számlálót."
  });
}

function improperToMixedQuestion(testId) {
  const whole = rand(1, 5);
  const d = rand(3, 9);
  const n = rand(1, d - 1);
  const improperN = whole * d + n;
  const answer = `${whole} ${n}/${d}`;
  const candidates = [
    { label: mixedLabel(whole + 1, n, d), value: `${whole + 1} ${n}/${d}` },
    { label: mixedLabel(whole, d - n, d), value: `${whole} ${d - n}/${d}` },
    { label: mixedLabel(n, whole, d), value: `${n} ${whole}/${d}` },
    { label: mixedLabel(whole + 1, d - n, d), value: `${whole + 1} ${d - n}/${d}` },
    { label: mixedLabel(whole + 2, n, d), value: `${whole + 2} ${n}/${d}` }
  ];
  const wrongs = [];
  const seen = new Set([answer]);
  candidates.forEach((choice) => {
    if (seen.has(choice.value) || wrongs.length >= 3) return;
    seen.add(choice.value);
    wrongs.push(choice);
  });
  for (let offset = 3; wrongs.length < 3; offset += 1) {
    const choice = {
      label: mixedLabel(whole + offset, (n % d) + 1, d),
      value: `${whole + offset} ${(n % d) + 1}/${d}`
    };
    if (seen.has(choice.value)) continue;
    seen.add(choice.value);
    wrongs.push(choice);
  }
  return makeChoiceQuestion({
    testId,
    html: `Írd vegyes tört alakba: ${rawFractionLabel(improperN, d)}`,
    choices: shuffle([
      { label: mixedLabel(whole, n, d), value: answer },
      ...wrongs.slice(0, 3)
    ]),
    answer,
    hint: "Oszd el a számlálót a nevezővel: hányados az egészrész, maradék a számláló."
  });
}

function fractionMultiplyNumeratorQuestion(testId) {
  const a = rand(1, 5);
  const b = rand(2, 8);
  const c = rand(1, 5);
  const d = rand(2, 8);
  const [sn] = simplifyFraction(a * c, b * d);
  return makeInputQuestion({
    testId,
    html: `Számold ki és egyszerűsítsd: ${rawFractionLabel(a, b)} · ${rawFractionLabel(c, d)}<small>Írd be az eredmény számlálóját!</small>`,
    answer: sn,
    hint: "Számlálót számlálóval, nevezőt nevezővel szorzunk, majd egyszerűsítünk."
  });
}

function reducibleFractionMultiplyDenominatorQuestion(testId) {
  const examples = [
    [2, 3, 3, 8],
    [4, 5, 5, 6],
    [6, 7, 7, 9],
    [3, 10, 5, 6],
    [8, 9, 3, 4]
  ];
  const [a, b, c, d] = pick(examples);
  const [, sd] = simplifyFraction(a * c, b * d);
  return makeInputQuestion({
    testId,
    html: `Számold ki és egyszerűsítsd: ${rawFractionLabel(a, b)} · ${rawFractionLabel(c, d)}<small>Írd be az eredmény nevezőjét!</small>`,
    answer: sd,
    hint: "A szorzatot a végén egyszerűsíteni kell."
  });
}

function fractionDivisionPartQuestion(testId) {
  const examples = [
    [2, 3, 4, 5],
    [3, 4, 2, 5],
    [5, 6, 10, 9],
    [4, 7, 2, 3]
  ];
  const [a, b, c, d] = pick(examples);
  const [sn, sd] = simplifyFraction(a * d, b * c);
  const askNumerator = Math.random() > 0.5;
  return makeInputQuestion({
    testId,
    html: `Számold ki: ${rawFractionLabel(a, b)} : ${rawFractionLabel(c, d)}<small>Írd be az eredmény ${askNumerator ? "számlálóját" : "nevezőjét"}!</small>`,
    answer: askNumerator ? sn : sd,
    hint: "Törttel úgy osztunk, hogy szorzunk a reciprokával, majd egyszerűsítünk."
  });
}

function fractionPowerChoiceQuestion(testId) {
  const n = rand(2, 5);
  const d = rand(n + 1, 8);
  const exp = rand(2, 3);
  return makeChoiceQuestion({
    testId,
    html: `${fractionPowerLabel(n, d, exp)} =`,
    choices: shuffle([
      exactFractionChoice(n ** exp, d ** exp),
      exactFractionChoice(n * exp, d * exp),
      exactFractionChoice(n ** exp, d),
      exactFractionChoice(n, d ** exp)
    ]),
    answer: `${n ** exp}/${d ** exp}`,
    hint: "Tört hatványozásánál a számlálót és a nevezőt is hatványozzuk."
  });
}

function fractionExpressionQuestion(testId) {
  const examples = [
    {
      html: `${rawFractionLabel(1, 2)} + ${rawFractionLabel(2, 3)} · ${rawFractionLabel(3, 4)} - ${rawFractionLabel(1, 6)}`,
      n: 5,
      d: 6
    },
    {
      html: `(${rawFractionLabel(3, 4)} - ${rawFractionLabel(1, 6)}) · ${rawFractionLabel(6, 7)} + ${rawFractionLabel(1, 2)}`,
      n: 1,
      d: 1
    },
    {
      html: `${rawFractionLabel(2, 3)} : ${rawFractionLabel(4, 9)} - ${rawFractionLabel(1, 2)} + ${rawFractionLabel(1, 4)}`,
      n: 5,
      d: 4
    },
    {
      html: `${fractionPowerLabel(1, 2, 2)} + ${rawFractionLabel(3, 5)} · ${rawFractionLabel(5, 6)} - ${rawFractionLabel(1, 4)}`,
      n: 1,
      d: 2
    }
  ];
  const item = pick(examples);
  return makeChoiceQuestion({
    testId,
    html: `${item.html} =`,
    choices: shuffle(fractionChoiceSet(item.n, item.d, [
      [item.n + 1, item.d],
      [item.n, item.d + 1],
      [Math.max(1, item.n - 1), item.d],
      [item.n + 2, item.d + 1],
      [item.n + item.d, item.d]
    ])),
    answer: fractionValue(item.n, item.d),
    hint: "Tartsd a műveleti sorrendet: zárójel, hatványozás, szorzás/osztás, összeadás/kivonás."
  });
}

function decimalAdditionQuestion(testId) {
  const a = roundTo(rand(12, 95) / 10, 1);
  const b = roundTo(rand(15, 98) / 100, 2);
  return makeDecimalInputQuestion({
    testId,
    html: `${decimalText(a)} + ${decimalText(b)} =`,
    answer: a + b,
    hint: "Írd egymás alá a számokat úgy, hogy a tizedesvesszők egymás alá kerüljenek."
  });
}

function trickyDecimalAdditionQuestion(testId) {
  const examples = [
    [3.7, 0.48],
    [12.05, 3.8],
    [4.006, 2.37],
    [15.4, 0.086],
    [7.09, 5.7]
  ];
  const [a, b] = pick(examples);
  return makeDecimalInputQuestion({
    testId,
    html: `${decimalText(a)} + ${decimalText(b)} =`,
    answer: a + b,
    hint: "A hiányzó helyiértékekre képzelj nullákat."
  });
}

function trickyDecimalSubtractionQuestion(testId) {
  const examples = [
    [8.2, 3.47],
    [10.05, 4.8],
    [6.003, 2.45],
    [15.1, 7.086],
    [20.04, 9.7]
  ];
  const [a, b] = pick(examples);
  return makeDecimalInputQuestion({
    testId,
    html: `${decimalText(a)} - ${decimalText(b)} =`,
    answer: a - b,
    hint: "Kivonásnál is a tizedesvesszők kerüljenek egymás alá."
  });
}

function decimalMultiplicationQuestion(testId) {
  const examples = [
    [1.2, 0.35],
    [2.4, 1.5],
    [0.48, 3.2],
    [4.05, 0.6],
    [0.75, 2.8],
    [3.06, 0.4]
  ];
  const [a, b] = pick(examples);
  const decimals = String(a).split(".")[1]?.length || 0;
  const decimalsB = String(b).split(".")[1]?.length || 0;
  return makeDecimalInputQuestion({
    testId,
    html: `${decimalText(a)} · ${decimalText(b)} =`,
    answer: a * b,
    hint: `Szorozd meg egész számként, majd összesen ${decimals + decimalsB} tizedesjegyet számolj vissza.`
  });
}

function decimalTimesIntegerQuestion(testId) {
  const a = pick([1.25, 2.4, 3.75, 4.08, 5.6, 7.05]);
  const b = rand(3, 9);
  return makeDecimalInputQuestion({
    testId,
    html: `${decimalText(a)} · ${b} =`,
    answer: a * b,
    hint: "Egész számmal szorozva annyiszor vesszük a tizedestörtet."
  });
}

function decimalBetweenChoiceQuestion(testId) {
  const base = rand(1, 8);
  const tenth = rand(1, 8);
  const low = roundTo(base + tenth / 10, 1);
  const high = roundTo(low + 0.1, 1);
  const answer = roundTo(low + rand(1, 9) / 100, 2);
  return makeChoiceQuestion({
    testId,
    html: `Melyik szám van ${decimalText(low)} és ${decimalText(high)} között?`,
    choices: shuffle([
      decimalChoice(answer),
      decimalChoice(roundTo(low - 0.01, 2)),
      decimalChoice(roundTo(high + 0.01, 2)),
      decimalChoice(roundTo(high + 0.1, 2))
    ]),
    answer: decimalPlainText(answer),
    hint: "A két szám között azok vannak, amelyek nagyobbak az elsőnél és kisebbek a másodiknál."
  });
}

function decimalOrderChoiceQuestion(testId) {
  const items = pick([
    [2.07, 2.7, 2.17, 2.071],
    [4.5, 4.05, 4.55, 4.505],
    [0.9, 0.19, 0.109, 0.91],
    [6.03, 6.3, 6.003, 6.33]
  ]);
  const answer = [...items].sort((a, b) => a - b).map((item) => decimalText(item)).join(" < ");
  const choices = shuffle([
    answer,
    [...items].sort((a, b) => b - a).map((item) => decimalText(item)).join(" < "),
    [items[1], items[0], items[2], items[3]].map((item) => decimalText(item)).join(" < "),
    [items[0], items[2], items[1], items[3]].map((item) => decimalText(item)).join(" < ")
  ]);
  return makeChoiceQuestion({
    testId,
    html: `Melyik a helyes növekvő sorrend?<br>${items.map((item) => decimalText(item)).join("; ")}`,
    choices,
    answer,
    hint: "A tizedesjegyeket helyiérték szerint hasonlítsd össze, ne a számjegyek darabszáma szerint."
  });
}

function repeatingDecimalDigitQuestion(testId) {
  const pattern = pick(["3", "27", "128", "405", "72"]);
  const position = rand(25, 160);
  const digit = pattern[(position - 1) % pattern.length];
  return makeInputQuestion({
    testId,
    html: `Mi a ${decimalText(`0,(${pattern})`)} szakaszos tizedestört vessző utáni ${position}. számjegye?`,
    answer: Number(digit),
    hint: `A szakasz hossza ${pattern.length}, ezért a hely sorszámát ezzel oszd maradékosan.`
  });
}

function fractionToDecimalQuestion(testId) {
  const examples = [
    [1, 2],
    [3, 4],
    [7, 8],
    [2, 5],
    [9, 20],
    [13, 25]
  ];
  const [n, d] = pick(examples);
  return makeDecimalInputQuestion({
    testId,
    html: `Írd át tizedestörtbe osztással: ${rawFractionLabel(n, d)} =`,
    answer: n / d,
    hint: "A számlálót oszd el a nevezővel."
  });
}

function decimalDivideIntegerQuestion(testId) {
  const result = pick([0.35, 1.25, 2.4, 3.75, 4.08, 5.6]);
  const divisor = rand(2, 9);
  const dividend = roundTo(result * divisor, 3);
  return makeDecimalInputQuestion({
    testId,
    html: `${decimalText(dividend)} : ${divisor} =`,
    answer: result,
    hint: "Osztásnál figyeld, mikor kerül a hányadosba a tizedesvessző."
  });
}

function finiteDecimalDivisionQuestion(testId) {
  const examples = [
    [4.8, 0.6, 8],
    [7.5, 1.5, 5],
    [3.24, 0.4, 8.1],
    [12.6, 0.3, 42],
    [5.25, 0.25, 21],
    [9.6, 1.2, 8]
  ];
  const [dividend, divisor, answer] = pick(examples);
  return makeDecimalInputQuestion({
    testId,
    html: `${decimalText(dividend)} : ${decimalText(divisor)} =`,
    answer,
    hint: "Szorozd meg az osztót és az osztandót ugyanazzal a 10-hatvánnyal, hogy az osztó egész legyen."
  });
}

function repeatingDecimalDivisionQuestion(testId) {
  const examples = [
    { dividend: 0.5, divisor: 1.5, answer: "0,(3)", wrongs: ["0,3", "0,33", "3"] },
    { dividend: 1.2, divisor: 0.9, answer: "1,(3)", wrongs: ["1,3", "1,33", "0,75"] },
    { dividend: 0.7, divisor: 0.3, answer: "2,(3)", wrongs: ["2,3", "2,33", "0,(3)"] },
    { dividend: 2.5, divisor: 1.1, answer: "2,(27)", wrongs: ["2,27", "2,72", "0,44"] }
  ];
  const item = pick(examples);
  const choices = shuffle([item.answer, ...item.wrongs]).map((value) => ({
    label: decimalText(value),
    value
  }));
  return makeChoiceQuestion({
    testId,
    html: `${decimalText(item.dividend)} : ${decimalText(item.divisor)} =`,
    choices,
    answer: item.answer,
    hint: "Szakaszos tizedestörtnél az ismétlődő számjegyeket zárójelbe tesszük."
  });
}

function finiteDecimalToFractionChoiceQuestion(testId) {
  const examples = [
    { decimal: 0.25, fraction: [1, 4], wrongs: [[25, 10], [1, 25], [2, 5]] },
    { decimal: 0.6, fraction: [3, 5], wrongs: [[6, 100], [6, 5], [3, 10]] },
    { decimal: 1.25, fraction: [5, 4], wrongs: [[125, 10], [1, 25], [4, 5]] },
    { decimal: 0.08, fraction: [2, 25], wrongs: [[8, 10], [8, 1000], [4, 25]] },
    { decimal: 2.75, fraction: [11, 4], wrongs: [[275, 10], [27, 5], [4, 11]] }
  ];
  const item = pick(examples);
  const [n, d] = item.fraction;
  return makeChoiceQuestion({
    testId,
    html: `Melyik közönséges tört egyenlő ezzel: ${decimalText(item.decimal)} ?`,
    choices: shuffle([fractionChoice(n, d), ...item.wrongs.map(([wn, wd]) => rawFractionChoice(wn, wd))]),
    answer: fractionValue(n, d),
    hint: "Írd fel 10, 100 vagy 1000 nevezővel, majd egyszerűsíts."
  });
}

function repeatingDecimalToFractionChoiceQuestion(testId) {
  const examples = [
    { decimal: "0,(3)", fraction: [1, 3], wrongs: [[3, 10], [1, 9], [3, 100]] },
    { decimal: "0,(6)", fraction: [2, 3], wrongs: [[6, 10], [1, 6], [6, 99]] },
    { decimal: "0,(27)", fraction: [3, 11], wrongs: [[27, 100], [27, 90], [2, 7]] },
    { decimal: "1,(2)", fraction: [11, 9], wrongs: [[12, 100], [6, 5], [10, 9]] }
  ];
  const item = pick(examples);
  const [n, d] = item.fraction;
  return makeChoiceQuestion({
    testId,
    html: `Melyik közönséges tört egyenlő ezzel: ${decimalText(item.decimal)} ?`,
    choices: shuffle([fractionChoice(n, d), ...item.wrongs.map(([wn, wd]) => rawFractionChoice(wn, wd))]),
    answer: fractionValue(n, d),
    hint: "Egyjegyű szakasznál például 0,(3) = 3/9 = 1/3."
  });
}

function decimalPlaceValueQuestion(testId) {
  const items = [
    { number: "34,728", place: "századok", answer: 2 },
    { number: "5,406", place: "ezredek", answer: 6 },
    { number: "120,309", place: "tizedek", answer: 3 },
    { number: "8,571", place: "századok", answer: 7 },
    { number: "43,095", place: "ezredek", answer: 5 }
  ];
  const item = pick(items);
  return makeInputQuestion({
    testId,
    html: `Melyik számjegy áll a ${item.place} helyén ebben a számban: ${item.number}?`,
    answer: item.answer,
    hint: "A vessző után sorban: tizedek, századok, ezredek."
  });
}

function decimalRoundingQuestion(testId) {
  const item = pick([
    { number: 12.374, name: "tizedre", places: 1 },
    { number: 5.086, name: "századra", places: 2 },
    { number: 48.951, name: "tizedre", places: 1 },
    { number: 7.995, name: "századra", places: 2 },
    { number: 63.449, name: "századra", places: 2 }
  ]);
  return makeDecimalInputQuestion({
    testId,
    html: `Kerekítsd a ${decimalText(item.number, 3)} számot ${item.name}!`,
    answer: roundTo(item.number, item.places),
    hint: "0, 1, 2, 3, 4 esetén lefelé, 5-től felfelé kerekítünk."
  });
}

function fractionPartQuestion(testId) {
  const examples = [
    [20, 3, 5],
    [36, 5, 6],
    [45, 2, 9],
    [72, 5, 8],
    [64, 3, 4]
  ];
  const [whole, n, d] = pick(examples);
  return makeInputQuestion({
    testId,
    html: `Mennyi a ${whole} szám ${rawFractionLabel(n, d)} része?`,
    answer: (whole / d) * n,
    hint: "Először oszd el a számot a nevezővel, majd szorozd meg a számlálóval."
  });
}

function decimalPriceQuestion(testId) {
  const examples = [
    [8, 13, 3],
    [6, 10.5, 4],
    [5, 12.5, 2],
    [12, 18.6, 5],
    [4, 7.8, 7]
  ];
  const [count, price, wanted] = pick(examples);
  return makeDecimalInputQuestion({
    testId,
    html: `${count} sapka ára ${decimalText(price)} lej. Mennyibe kerül ${wanted} sapka?`,
    answer: (price / count) * wanted,
    hint: "Először számold ki 1 sapka árát, aztán szorozd meg a kért darabszámmal."
  });
}

function decimalExpressionQuestion(testId) {
  const examples = [
    {
      html: `${powerLabel(decimalFractionLabel(1.2), 2)} + ${decimalText(3.6)} : ${decimalText(0.6)} - ${decimalText(2.4)} · ${decimalText(1.5)}`,
      answer: 3.84
    },
    {
      html: `(${decimalText(4.5)} - ${decimalText(1.2)}) · ${decimalText(2)} + ${powerLabel(decimalFractionLabel(0.8), 2)} : ${decimalText(0.4)}`,
      answer: 8.2
    },
    {
      html: `${decimalText(6.4)} : ${decimalText(0.8)} + ${decimalText(1.25)} · ${decimalText(4)} - ${powerLabel(decimalFractionLabel(1.5), 2)}`,
      answer: 10.75
    },
    {
      html: `(${decimalText(7.2)} - ${decimalText(2.4)}) : ${decimalText(0.6)} + ${powerLabel(decimalFractionLabel(0.5), 2)} · ${decimalText(8)}`,
      answer: 10
    }
  ];
  const item = pick(examples);
  return makeDecimalInputQuestion({
    testId,
    html: `${item.html} =`,
    answer: item.answer,
    hint: "A sorrend: zárójel, hatványozás, szorzás/osztás, majd összeadás/kivonás."
  });
}

function geometryChoiceQuestion(testId, html, answer, wrongs, hint) {
  return makeChoiceQuestion({
    testId,
    html,
    choices: shuffle([answer, ...wrongs]),
    answer,
    hint
  });
}

function geometryPointTheoryQuestion(testId) {
  return geometryChoiceQuestion(
    testId,
    "Mit nevezünk pontnak a mértanban?",
    "nincs kiterjedése, csak helye van",
    [
      "két végpontja van",
      "végtelen hosszú, egyenes vonal",
      "egy pontból indul és egy irányban végtelen"
    ],
    "A pontot általában nagybetűvel jelöljük."
  );
}

function geometryLineTheoryQuestion(testId) {
  return geometryChoiceQuestion(
    testId,
    "Melyik állítás igaz az egyenesre?",
    "végtelen hosszú, egyenes vonal",
    [
      "két végpontja van",
      "csak egyetlen pontból áll",
      "mindig zárt alakzat"
    ],
    "Az egyenest kisbetűvel vagy két ponttal is jelölhetjük."
  );
}

function geometryRayTheoryQuestion(testId) {
  return geometryChoiceQuestion(
    testId,
    "Mi jellemzi a félegyenest?",
    "van kezdőpontja, és egy irányban végtelen",
    [
      "két végpontja van",
      "nincs kezdőpontja és nincs végpontja",
      "csak terület mérésére használjuk"
    ],
    "A félegyenes egy pontból indul."
  );
}

function geometrySegmentTheoryQuestion(testId) {
  return geometryChoiceQuestion(
    testId,
    "Mit nevezünk szakasznak?",
    "két végpontja van, egy egyenes része",
    [
      "nincs végpontja",
      "egy pontból indul és végtelen",
      "csak görbe vonal lehet"
    ],
    "A szakasz hossza mérhető."
  );
}

function geometryElementTheoryQuestion(testId) {
  return geometryChoiceQuestion(
    testId,
    "Mit jelent a P ∈ a jelölés?",
    "a P pont rajta van az a egyenesen",
    [
      "a P pont nincs rajta az a egyenesen",
      "a P pont párhuzamos az a egyenessel",
      "az a egyenes rövidebb, mint a P pont"
    ],
    "Az ∈ jel azt jelenti: eleme, rajta van."
  );
}

function geometryCollinearTheoryQuestion(testId) {
  return geometryChoiceQuestion(
    testId,
    "Mikor kollineáris három pont?",
    "ha egy egyenesen vannak",
    [
      "ha három különböző egyenesen vannak",
      "ha egy téglalap csúcsai",
      "ha azonos távolságra vannak az origótól"
    ],
    "Kollineáris pontok egy közös egyenesre illeszkednek."
  );
}

function geometryParallelTheoryQuestion(testId) {
  return geometryChoiceQuestion(
    testId,
    "Mit jelent, hogy két egyenes párhuzamos?",
    "nem metszik egymást",
    [
      "pontosan egy pontban metszik egymást",
      "több pontban metszik egymást",
      "mindig merőlegesek egymásra"
    ],
    "Párhuzamos egyenesek jele: a ∥ b."
  );
}

function arithmeticMeanIntegerQuestion(testId) {
  const examples = [
    [4, 8, 10, 14],
    [6, 9, 12, 17],
    [3, 7, 11, 19],
    [12, 18, 20, 30]
  ];
  const values = pick(examples);
  const answer = values.reduce((sum, value) => sum + value, 0) / values.length;
  return makeInputQuestion({
    testId,
    html: `Számold ki a számtani közepet:<br>${values.join(", ")}`,
    answer,
    hint: "Add össze az adatokat, majd oszd el az adatok számával."
  });
}

function arithmeticMeanDecimalQuestion(testId) {
  const examples = [
    [1.5, 2.5, 4, 6],
    [3, 4, 7, 8],
    [2.4, 3.6, 5.2, 6.8]
  ];
  const values = pick(examples);
  const answer = values.reduce((sum, value) => sum + value, 0) / values.length;
  return makeDecimalInputQuestion({
    testId,
    html: `Számold ki a számtani közepet:<br>${values.map((value) => decimalText(value)).join("; ")}`,
    answer,
    hint: "A számtani közép = adatok összege : adatok száma."
  });
}

function unitPower(value, fromIndex, toIndex, base) {
  return value * (base ** (fromIndex - toIndex));
}

function lengthConversionQuestion(testId) {
  const units = ["mm", "cm", "dm", "m", "dam", "hm", "km"];
  const examples = [
    { value: 4.5, from: "m", to: "cm" },
    { value: 720, from: "cm", to: "m" },
    { value: 3.2, from: "km", to: "m" },
    { value: 5800, from: "mm", to: "m" },
    { value: 12.5, from: "dm", to: "cm" },
    { value: 0.75, from: "km", to: "m" }
  ];
  const item = pick(examples);
  const answer = unitPower(item.value, units.indexOf(item.from), units.indexOf(item.to), 10);
  return makeDecimalInputQuestion({
    testId,
    html: `Váltsd át: ${decimalText(item.value)} ${item.from} = ? ${item.to}<small>Csak a számot írd be!</small>`,
    answer,
    hint: "Hosszúságnál lefelé haladva 10-zel szorzunk, felfelé haladva 10-zel osztunk lépésenként."
  });
}

function areaConversionQuestion(testId) {
  const units = ["mm²", "cm²", "dm²", "m²", "dam²", "hm²", "km²"];
  const examples = [
    { value: 7, from: "cm²", to: "mm²" },
    { value: 2500, from: "cm²", to: "m²" },
    { value: 3.5, from: "m²", to: "dm²" },
    { value: 48000, from: "mm²", to: "cm²" },
    { value: 0.25, from: "m²", to: "cm²" }
  ];
  const item = pick(examples);
  const answer = unitPower(item.value, units.indexOf(item.from), units.indexOf(item.to), 100);
  return makeDecimalInputQuestion({
    testId,
    html: `Váltsd át: ${decimalText(item.value)} ${item.from} = ? ${item.to}<small>Csak a számot írd be!</small>`,
    answer,
    hint: "Területnél minden lépés váltószáma 100."
  });
}

function volumeConversionQuestion(testId) {
  const units = ["mm³", "cm³", "dm³", "m³", "dam³", "hm³", "km³"];
  const examples = [
    { value: 7, from: "cm³", to: "mm³" },
    { value: 2500, from: "cm³", to: "m³" },
    { value: 3.5, from: "dm³", to: "cm³" },
    { value: 12000, from: "mm³", to: "cm³" },
    { value: 0.004, from: "m³", to: "dm³" }
  ];
  const item = pick(examples);
  const answer = unitPower(item.value, units.indexOf(item.from), units.indexOf(item.to), 1000);
  return makeDecimalInputQuestion({
    testId,
    html: `Váltsd át: ${decimalText(item.value)} ${item.from} = ? ${item.to}<small>Csak a számot írd be!</small>`,
    answer,
    hint: "Térfogatnál minden lépés váltószáma 1000."
  });
}

function rectanglePerimeterQuestion(testId) {
  const a = rand(4, 18);
  const b = rand(2, 12);
  return makeInputQuestion({
    testId,
    html: `Egy téglalap oldalai ${a} cm és ${b} cm. Mennyi a kerülete cm-ben?`,
    answer: 2 * (a + b),
    hint: "Téglalap kerülete: K = 2 · (hosszúság + szélesség)."
  });
}

function rectangleAreaQuestion(testId) {
  const a = rand(4, 18);
  const b = rand(2, 12);
  return makeInputQuestion({
    testId,
    html: `Egy téglalap oldalai ${a} cm és ${b} cm. Mennyi a területe cm²-ben?`,
    answer: a * b,
    hint: "Téglalap területe: T = hosszúság · szélesség."
  });
}

function mixedUnitRectangleQuestion(testId) {
  const examples = [
    { a: 2.4, au: "m", b: 80, bu: "cm", ask: "perimeter", unit: "cm", answer: 640 },
    { a: 1.5, au: "m", b: 40, bu: "cm", ask: "area", unit: "cm²", answer: 6000 },
    { a: 3.2, au: "dm", b: 45, bu: "cm", ask: "perimeter", unit: "cm", answer: 154 },
    { a: 2.5, au: "m", b: 12, bu: "dm", ask: "area", unit: "m²", answer: 3 },
    { a: 75, au: "cm", b: 1.2, bu: "m", ask: "perimeter", unit: "cm", answer: 390 }
  ];
  const item = pick(examples);
  const label = item.ask === "area" ? "területe" : "kerülete";
  return makeDecimalInputQuestion({
    testId,
    html: `Egy téglalap oldalai ${decimalText(item.a)} ${item.au} és ${decimalText(item.b)} ${item.bu}. Mennyi a ${label} ${item.unit}-ben?<small>Csak a számot írd be!</small>`,
    answer: item.answer,
    hint: "Először váltsd az oldalakat ugyanabba a mértékegységbe."
  });
}

function cuboidVolumeQuestion(testId) {
  const examples = [
    [4, 3, 2],
    [5, 4, 3],
    [8, 3, 2],
    [6, 5, 4],
    [9, 2, 3]
  ];
  const [a, b, c] = pick(examples);
  return makeInputQuestion({
    testId,
    html: `Egy téglatest élei ${a} cm, ${b} cm és ${c} cm. Mennyi a térfogata cm³-ben?`,
    answer: a * b * c,
    hint: "Téglatest térfogata: V = a · b · c."
  });
}

function loadProgress() {
  const fallback = { name: "", nameLog: [], attempts: 0, completed: 0, byTest: {}, history: [], practiceTime: createEmptyPracticeTime() };
  try {
    return normalizeProgress(JSON.parse(localStorage.getItem("matekMuhelyTestProgress") || "{}"));
  } catch {
    return fallback;
  }
}

function normalizeProgress(data) {
  const source = data && typeof data === "object" ? data : {};
  const byTest = {};
  Object.entries(source.byTest || {}).forEach(([testId, row]) => {
    byTest[testId] = {
      attempts: Number(row?.attempts) || 0,
      completed: Number(row?.completed) || 0,
      bestRun: Number(row?.bestRun) || 0,
      answered: Number(row?.answered) || 0
    };
  });
  const nameLog = normalizeNameLog(source);
  return {
    ...fallback,
    name: String(source.name || ""),
    nameLog,
    attempts: Number(source.attempts) || 0,
    completed: Number(source.completed) || 0,
    byTest,
    history: Array.isArray(source.history) ? source.history.slice(-300) : [],
    practiceTime: normalizePracticeTime(source.practiceTime)
  };
}

function createEmptyPracticeTime() {
  return {
    days: {},
    lastActivityAt: "",
    longestDay: { date: "", seconds: 0 },
    warnedDays: []
  };
}

function normalizePracticeTime(data) {
  const source = data && typeof data === "object" ? data : {};
  const days = {};
  Object.entries(source.days || {}).forEach(([date, seconds]) => {
    const cleanDate = String(date || "");
    const cleanSeconds = Math.max(0, Math.round(Number(seconds) || 0));
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate) && cleanSeconds > 0) {
      days[cleanDate] = cleanSeconds;
    }
  });

  let longestDay = source.longestDay && typeof source.longestDay === "object"
    ? {
        date: String(source.longestDay.date || ""),
        seconds: Math.max(0, Math.round(Number(source.longestDay.seconds) || 0))
      }
    : { date: "", seconds: 0 };

  Object.entries(days).forEach(([date, seconds]) => {
    if (seconds > longestDay.seconds) {
      longestDay = { date, seconds };
    }
  });

  return {
    days,
    lastActivityAt: typeof source.lastActivityAt === "string" ? source.lastActivityAt : "",
    longestDay,
    warnedDays: Array.isArray(source.warnedDays) ? source.warnedDays.map(String).slice(-60) : []
  };
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDuration(seconds) {
  const totalMinutes = Math.max(0, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return `${hours} óra ${minutes} perc`;
  if (hours) return `${hours} óra`;
  return `${minutes} perc`;
}

function recordPracticeActivity({ showWarning = false } = {}) {
  const now = new Date();
  const practiceTime = normalizePracticeTime(state.progress.practiceTime);
  const today = todayKey(now);
  const last = practiceTime.lastActivityAt ? new Date(practiceTime.lastActivityAt) : null;
  const sameDay = last && todayKey(last) === today;
  const gapSeconds = last ? Math.max(0, Math.round((now - last) / 1000)) : 0;

  if (sameDay && gapSeconds > 0 && gapSeconds <= MAX_ACTIVITY_GAP_SECONDS) {
    practiceTime.days[today] = (practiceTime.days[today] || 0) + gapSeconds;
  } else {
    practiceTime.days[today] = practiceTime.days[today] || 0;
  }

  practiceTime.lastActivityAt = now.toISOString();
  if ((practiceTime.days[today] || 0) > (practiceTime.longestDay.seconds || 0)) {
    practiceTime.longestDay = { date: today, seconds: practiceTime.days[today] };
  }

  state.progress.practiceTime = practiceTime;

  const crossedLimit = practiceTime.days[today] > DAILY_PRACTICE_LIMIT_SECONDS;
  const alreadyWarned = practiceTime.warnedDays.includes(today);
  if (showWarning && crossedLimit && !alreadyWarned) {
    practiceTime.warnedDays = [...practiceTime.warnedDays, today].slice(-60);
    state.progress.practiceTime = practiceTime;
    setFeedback("Ma már több mint 1 órát gyakoroltál aktívan. Szép munka, de most tarts egy kis szünetet!", "good");
    return true;
  }

  return false;
}

function practiceTimeAuditHtml() {
  const practiceTime = normalizePracticeTime(state.progress.practiceTime);
  const todaySeconds = practiceTime.days[todayKey()] || 0;
  const longestSeconds = practiceTime.longestDay.seconds || 0;
  const overLimit = Math.max(0, longestSeconds - DAILY_PRACTICE_LIMIT_SECONDS);

  if (!longestSeconds) {
    return `
      <br><br><strong>Aktív gyakorlási idő</strong><br>
      Még nincs mérhető aktív gyakorlási idő ebben a mentésben.
    `;
  }

  return `
    <br><br><strong>Aktív gyakorlási idő</strong><br>
    Mai aktív gyakorlás: ${formatDuration(todaySeconds)}<br>
    Leghosszabb munka: ${practiceTime.longestDay.date}, ${formatDuration(longestSeconds)}<br>
    Az 1 órás határ túllépése: ${overLimit ? formatDuration(overLimit) : "nem lépte át"}
  `;
}

function normalizeNameLog(source) {
  const entries = [];
  if (Array.isArray(source.nameLog)) {
    source.nameLog.forEach((item) => {
      if (typeof item === "string") {
        entries.push({ name: item, date: "" });
      } else if (item && typeof item === "object") {
        entries.push({ name: item.name, date: item.date });
      }
    });
  }
  if (Array.isArray(source.names)) {
    source.names.forEach((name) => entries.push({ name, date: "" }));
  }
  if (source.name) {
    entries.push({ name: source.name, date: "" });
  }

  const seen = new Set();
  return entries.reduce((names, item) => {
    const name = String(item.name || "").trim();
    if (!name || seen.has(name.toLocaleLowerCase("hu-HU"))) {
      return names;
    }
    seen.add(name.toLocaleLowerCase("hu-HU"));
    names.push({
      name,
      date: String(item.date || new Date().toISOString())
    });
    return names;
  }, []).slice(-20);
}

function recordStudentName(name) {
  const cleanName = String(name || "").trim();
  if (!cleanName) return;
  const key = cleanName.toLocaleLowerCase("hu-HU");
  const existing = (state.progress.nameLog || []).some((item) => String(item.name || "").toLocaleLowerCase("hu-HU") === key);
  if (!existing) {
    state.progress.nameLog = [...(state.progress.nameLog || []), { name: cleanName, date: new Date().toISOString() }].slice(-20);
  }
}

function saveProgress() {
  localStorage.setItem("matekMuhelyTestProgress", JSON.stringify(state.progress));
}

const BACKUP_PREFIX = "MATEK-MUHELY-2:";
const BACKUP_SALT = "matek-muhely-vakacio-2026";

function checksumText(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function encodeUnicodeBase64(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeUnicodeBase64(text) {
  return decodeURIComponent(escape(atob(text)));
}

function encodeBackup(progress) {
  const payload = JSON.stringify({
    app: "Matek Műhely",
    version: 2,
    savedAt: new Date().toISOString(),
    progress
  });
  const encoded = encodeUnicodeBase64(payload);
  const checksum = checksumText(`${BACKUP_SALT}:${encoded}`);
  return `${BACKUP_PREFIX}${checksum}:${encoded}`;
}

function decodeBackup(text) {
  const content = String(text || "").trim();
  if (!content.startsWith(BACKUP_PREFIX)) {
    return JSON.parse(content);
  }

  const rest = content.slice(BACKUP_PREFIX.length);
  const separatorIndex = rest.indexOf(":");
  if (separatorIndex < 1) {
    throw new Error("Hibás mentésfájl.");
  }
  const checksum = rest.slice(0, separatorIndex);
  const encoded = rest.slice(separatorIndex + 1);
  if (checksumText(`${BACKUP_SALT}:${encoded}`) !== checksum) {
    throw new Error("A mentésfájl ellenőrzése nem sikerült.");
  }
  const parsed = JSON.parse(decodeUnicodeBase64(encoded));
  return parsed.progress;
}

function selectedTest() {
  return tests.find((test) => test.id === state.selectedTest) || tests[0];
}

function getTestRow(testId) {
  const row = state.progress.byTest[testId] || {};
  return {
    attempts: row.attempts || 0,
    completed: row.completed || 0,
    bestRun: row.bestRun || 0,
    answered: row.answered || 0
  };
}

function createRun() {
  const test = selectedTest();
  if (test.id === "summary") {
    const sourceFactories = tests
      .filter((item) => item.id !== "summary")
      .flatMap((item) => item.factories);
    return Array.from({ length: test.length }, () => pick(sourceFactories)("summary"));
  }
  return shuffle(test.factories.map((factory) => factory(test.id)));
}

function startRun(resetMessage = true) {
  const warned = resetMessage ? recordPracticeActivity({ showWarning: true }) : false;
  state.run = createRun();
  state.index = 0;
  state.active = true;
  state.selectedChoice = null;
  state.progress.attempts += 1;
  const row = getTestRow(state.selectedTest);
  row.attempts += 1;
  state.progress.byTest[state.selectedTest] = row;
  saveProgress();
  renderAll();
  if (resetMessage && !warned) {
    setFeedback(`Kezdhetjük. A cél: ${selectedTest().length} hibátlan válasz egymás után.`, "");
  }
}

function failAndRestart(question, value) {
  const row = getTestRow(state.selectedTest);
  row.answered += 1;
  row.bestRun = Math.max(row.bestRun, state.index);
  state.progress.history.push(makeHistory(question, value, false));
  state.progress.history = state.progress.history.slice(-300);
  state.progress.byTest[state.selectedTest] = row;
  saveProgress();
  renderStats();
  setFeedback(`Hiba történt. A jó válasz: ${plainTextAnswer(question)}. Új teszt indul új feladatokkal.`, "bad");
  disableAnswering(true);
  setTimeout(() => startRun(false), 1500);
}

function completeRun(question, value) {
  const test = selectedTest();
  const row = getTestRow(state.selectedTest);
  row.answered += 1;
  row.completed += 1;
  row.bestRun = test.length;
  state.progress.completed += 1;
  state.progress.history.push(makeHistory(question, value, true));
  state.progress.history = state.progress.history.slice(-300);
  state.progress.byTest[state.selectedTest] = row;
  state.active = false;
  saveProgress();
  renderAll();
  setFeedback(`Sikerült! Megvan a ${test.length} hibátlan feladat.`, "good");
}

function makeHistory(question, value, correct) {
  return {
    date: new Date().toISOString(),
    student: state.progress.name || "",
    test: state.selectedTest,
    question: question.html.replace(/<[^>]+>/g, " "),
    answer: String(value || ""),
    expected: String(question.answer),
    correct
  };
}

function plainTextAnswer(question) {
  return (question.answerLabel || String(question.answer))
    .replace(/<span class="math-frac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, "$1/$2")
    .replace(/<span class="math-power"><span class="power-base">(.*?)<\/span><span class="power-exp">(.*?)<\/span><\/span>/g, "$1^$2")
    .replace(/<sup>(.*?)<\/sup>/g, "^$1")
    .replace(/<[^>]+>/g, "");
}

function renderAll() {
  renderTests();
  renderStats();
  renderAwards();
  renderRunProgress();
  renderQuestion();
}

function renderTests() {
  els.testButtons.innerHTML = tests.map((test) => `
    <button class="test-card ${test.id === state.selectedTest ? "active" : ""}" type="button" data-test="${test.id}">
      ${test.icon ? `<img src="${test.icon}" alt="">` : `<span class="test-fallback-icon">aⁿ</span>`}
      <span class="test-copy">
        <strong>${test.name}</strong>
        <small>${test.summary}</small>
      </span>
    </button>
  `).join("");
}

function renderStats() {
  const p = state.progress;
  const test = selectedTest();
  const selectedRow = getTestRow(test.id);
  els.studentName.value = p.name || "";
  els.completedTests.textContent = p.completed || 0;
  els.bestRun.textContent = `${selectedRow.bestRun || 0}/${test.length}`;
  els.attempts.textContent = p.attempts || 0;
  els.testProgress.innerHTML = tests.map((item) => {
    const row = getTestRow(item.id);
    const percent = Math.round((row.bestRun / item.length) * 100);
    return `<div class="progress-row">
      <strong>${item.name}: ${row.bestRun || 0}/${item.length}</strong>
      <div class="bar"><span style="width:${percent}%"></span></div>
    </div>`;
  }).join("");
}

function answeredCount(testId) {
  const row = getTestRow(testId);
  if (row.answered) return row.answered;
  return (state.progress.history || []).filter((item) => item.test === testId).length;
}

function renderAwards() {
  const earnedTests = tests.filter((test) => (getTestRow(test.id).completed || 0) > 0 && test.icon);
  if (!earnedTests.length) {
    els.awardsList.innerHTML = '<span class="empty-award">Még nincs kitüntetés.</span>';
    els.awardDetails.textContent = "A sikeres tesztek ikonjai itt jelennek meg.";
    return;
  }

  els.awardsList.innerHTML = earnedTests.map((test) => `
    <button class="award-btn" type="button" data-award="${test.id}" title="${test.name}">
      <img src="${test.icon}" alt="">
    </button>
  `).join("");

  if (!els.awardDetails.dataset.locked) {
    const first = earnedTests[0];
    els.awardDetails.textContent = `${first.name}: összesen ${answeredCount(first.id)} beküldött feladat minden próbálkozással együtt.`;
  }
}

function renderRunProgress() {
  const test = selectedTest();
  els.runProgress.style.setProperty("--steps", test.length > 10 ? 8 : 5);
  els.runProgress.innerHTML = Array.from({ length: test.length }, (_, i) => {
    const status = !state.active ? "" : i < state.index ? "done" : i === state.index ? "current" : "";
    return `<span class="step-dot ${status}">${i + 1}</span>`;
  }).join("");
}

function shouldCompactQuestion(html) {
  const text = String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const powerCount = (String(html || "").match(/math-power/g) || []).length;
  const fractionCount = (String(html || "").match(/math-frac/g) || []).length;
  return text.length > 76 || (powerCount >= 1 && text.length > 34) || fractionCount >= 3;
}

function shouldKeepQuestionOnOneLine(html) {
  const content = String(html || "");
  const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const powerCount = (content.match(/math-power/g) || []).length;
  const fractionCount = (content.match(/math-frac/g) || []).length;
  return powerCount === 1 && fractionCount === 0 && !content.includes("math-line") && text.length <= 64;
}

function renderQuestion() {
  const test = selectedTest();
  disableAnswering(!state.active);
  if (!state.active) {
    els.questionMeta.textContent = test.name;
    els.questionText.className = "question-text";
    els.questionText.innerHTML = `<div class="question-content">Válaszd ki és indítsd el a ${test.length} kérdéses kihívást.</div>`;
    els.answerArea.innerHTML = "";
    setFeedback("Hibánál a teszt új feladatokkal az elejéről indul.", "");
    return;
  }

  const question = state.run[state.index];
  state.selectedChoice = null;
  els.questionMeta.textContent = `${test.name} · ${state.index + 1}/${test.length}`;
  els.questionText.className = [
    "question-text",
    shouldCompactQuestion(question.html) ? "compact" : "",
    shouldKeepQuestionOnOneLine(question.html) ? "one-line" : ""
  ].filter(Boolean).join(" ");
  els.questionText.innerHTML = `<div class="question-content">${question.html}</div>`;

  if (question.type === "choice") {
    els.answerArea.innerHTML = `<div class="choice-grid">${question.choices.map((choice) => (
      `<button class="choice-btn" type="button" data-choice="${escapeAttribute(choice.value)}">${choice.label}</button>`
    )).join("")}</div>`;
  } else {
    els.answerArea.innerHTML = `<input id="answerInput" type="text" inputmode="decimal" autocomplete="off" placeholder="Egyetlen szám">`;
    document.querySelector("#answerInput").focus();
  }
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setFeedback(text, type) {
  els.feedback.className = `feedback ${type || ""}`.trim();
  els.feedback.textContent = text;
}

function showNameAudit() {
  const names = normalizeNameLog(state.progress);
  state.progress.nameLog = names;
  saveProgress();
  els.awardDetails.dataset.locked = "true";
  if (!names.length) {
    els.awardDetails.innerHTML = `Tanári ellenőrzés: ebben a mentésben még nincs beírt név.${practiceTimeAuditHtml()}`;
    return;
  }
  els.awardDetails.innerHTML = `
    <strong>Tanári ellenőrzés</strong><br>
    Ebben a mentésben eddig ezek a nevek szerepeltek:<br>
    ${names.map((item) => `<span class="audit-name">${escapeHtml(item.name)}</span>`).join(", ")}
    ${practiceTimeAuditHtml()}
  `;
}

function disableAnswering(disabled) {
  els.checkBtn.disabled = disabled;
  els.hintBtn.disabled = disabled;
  els.restartBtn.disabled = !state.active;
}

function checkAnswer() {
  if (!state.active) return;
  const warned = recordPracticeActivity({ showWarning: true });
  const question = state.run[state.index];
  let value = "";
  let ok = false;

  if (question.type === "choice") {
    value = state.selectedChoice;
    ok = value === question.answer;
  } else {
    value = document.querySelector("#answerInput").value;
    ok = question.checker(value);
  }

  if (!ok) {
    failAndRestart(question, value);
    return;
  }

  state.index += 1;
  if (state.index >= selectedTest().length) {
    completeRun(question, value);
    if (warned) {
      setFeedback("Ma már több mint 1 órát gyakoroltál aktívan. Szép munka, de most tarts egy kis szünetet!", "good");
    }
    return;
  }

  state.progress.history.push(makeHistory(question, value, true));
  state.progress.history = state.progress.history.slice(-300);
  const row = getTestRow(state.selectedTest);
  row.answered += 1;
  row.bestRun = Math.max(row.bestRun, state.index);
  state.progress.byTest[state.selectedTest] = row;
  saveProgress();
  renderAll();
  if (!warned) {
    setFeedback("Helyes. Jöhet a következő.", "good");
  }
}

function exportProgress() {
  recordStudentName(state.progress.name);
  const data = encodeBackup(state.progress);
  const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = (state.progress.name || "tanulo").trim().replace(/[^\w-]+/g, "_");
  link.href = url;
  link.download = `matek-muhely-haladas-${safeName}.mmh`;
  link.click();
  URL.revokeObjectURL(url);
}

function importProgressFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = normalizeProgress(decodeBackup(reader.result));
      state.progress = imported;
      state.active = false;
      state.index = 0;
      state.run = [];
      state.selectedChoice = null;
      saveProgress();
      renderAll();
      setFeedback("A haladás sikeresen betöltve. A kitüntetések és statisztikák frissültek.", "good");
    } catch {
      setFeedback("Ezt a fájlt nem sikerült betölteni. Válaszd a korábban mentett haladásfájlt.", "bad");
    } finally {
      els.importInput.value = "";
    }
  });
  reader.addEventListener("error", () => {
    els.importInput.value = "";
    setFeedback("A fájl olvasása nem sikerült. Próbáld meg újra.", "bad");
  });
  reader.readAsText(file, "utf-8");
}

els.testButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-test]");
  if (!button) return;
  state.selectedTest = button.dataset.test;
  state.active = false;
  renderAll();
});

els.answerArea.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-choice]");
  if (!button) return;
  recordPracticeActivity();
  saveProgress();
  state.selectedChoice = button.dataset.choice;
  document.querySelectorAll(".choice-btn").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
});

els.awardsList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-award]");
  if (!button) return;
  const test = tests.find((item) => item.id === button.dataset.award);
  if (!test) return;
  els.awardDetails.dataset.locked = "true";
  els.awardDetails.textContent = `${test.name}: összesen ${answeredCount(test.id)} beküldött feladat minden próbálkozással együtt.`;
});

els.studentName.addEventListener("input", () => {
  state.progress.name = els.studentName.value.trim();
  recordStudentName(state.progress.name);
  saveProgress();
});

els.schoolCrestBtn.addEventListener("click", showNameAudit);

els.startBtn.addEventListener("click", () => startRun(true));
els.restartBtn.addEventListener("click", () => startRun(true));
els.checkBtn.addEventListener("click", checkAnswer);
els.hintBtn.addEventListener("click", () => {
  if (!state.active) return;
  const warned = recordPracticeActivity({ showWarning: true });
  saveProgress();
  if (!warned) {
    setFeedback(state.run[state.index].hint, "");
  }
});
els.exportBtn.addEventListener("click", exportProgress);
els.importBtn.addEventListener("click", () => els.importInput.click());
els.importInput.addEventListener("change", () => importProgressFile(els.importInput.files?.[0]));

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
});

renderAll();
