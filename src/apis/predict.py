import pandas as pd
import numpy as np
from ..utils.table_operation import find_column_dtype


def prediction_model(model, model_file, df: pd.DataFrame, inputs, outputs, values):
    _inputs = []
    # Preprocess inputs
    for i in range(len(inputs)):
        input = inputs[i]
        if len(input['dtype']) != 0:
            if model['wrangling']['normalizationCategorical'] == 'numeric_encoding':
                _processed_input = input['dtype'].index(values[i])
                _inputs.append(_processed_input)
        else:
            if model['wrangling']['normalizationNumeric'] == 'min_max_scaling':
                _processed_input = (
                    values[i] - df[input['key']].min()) / (df[input['key']].max() - df[input['key']].min())
                _inputs.append(_processed_input)
            elif model['wrangling']['normalizationNumeric'] == 'z_score':
                _processed_input = (
                    values[i] - df[input['key']].mean()) / df[input['key']].std()
                _inputs.append(_processed_input)
    # Predict
    _prediction = model_file.predict([_inputs])
    # Postprocess outputs
    _outputs = []
    for i in range(len(outputs)):
        output = outputs[i]
        if len(output['dtype']) != 0:
            if model['wrangling']['normalizationCategory'] == 'numeric_encoding':
                _processed_output = output['dtype'][_prediction[i]]
                _outputs.append(_processed_output)
        else:
            if model['wrangling']['normalizationNumeric'] == 'min_max_scaling':
                _processed_output = _prediction[i] * \
                    (df[output['key']].max() - df[output['key']].min()) + \
                    df[output['key']].min()
                _outputs.append(_processed_output)
            elif model['wrangling']['normalizationNumeric'] == 'z_score':
                _processed_output = _prediction[i] * \
                    df[output['key']].std() + df[output['key']].mean()
                _outputs.append(_processed_output)
    return [output.tolist() for output in _outputs]
