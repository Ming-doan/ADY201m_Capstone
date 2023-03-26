export const stepItems = [
  {
    title: "Data",
    description: "Preprocess Data",
  },
  {
    title: "Model",
    description: "Configure Model",
  },
  {
    title: "Train",
    description: "Training Model",
  },
];

export const wranglingFillingNANumericOptions = [
  {
    value: "mean",
    label: "Mean",
  },
];

export const wranglingFillingNACategoricalOptions = [
  {
    value: "most_frequent",
    label: "Most Frequent",
  },
];

export const wranglingNormalizationNumericOptions = [
  {
    value: "min_max_scaling",
    label: "Min Max Scaling",
  },
  {
    value: "z_score",
    label: "Z Score",
  },
];

export const wranglingNormalizationCategoricalOptions = [
  {
    value: "numeric_encoding",
    label: "Numeric Encoding",
  },
];

export const modelAlgorithmOptions = [
  {
    value: "sklearn/linear_regression",
    label: "Scikit-Learn/Linear Regression",
    inputs: 1,
    ouputs: 1,
    disabled: true,
  },
  {
    value: "sklearn/muliple_linear_regression",
    label: "Scikit-Learn/Multiple Linear Regression",
    inputs: -1,
    ouputs: 1,
    disabled: true,
  },
  {
    value: "numpy/polynomial_regression",
    label: "Numpy/Polynomial Regression",
    inputs: 1,
    ouputs: 1,
    disabled: true,
  },
  {
    value: "sklearn/logistic_regression",
    label: "Scikit-Learn/Logistic Regression",
    inputs: 1,
    ouputs: 1,
    disabled: true,
  },
  {
    value: "keras/neural_network",
    label: "Keras/Neural Network",
    inputs: -1,
    ouputs: -1,
    disabled: true,
  },
];
