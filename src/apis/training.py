# Preprocessing
from sklearn.model_selection import train_test_split
import pandas as pd
# Sklearn
from sklearn.linear_model import LinearRegression, LogisticRegression
# Numpy
from numpy import poly1d, polyfit
# Keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense


init_model_config = {
    'degree': 1,
}


def training_model(data_id: str, df: pd.DataFrame, model: str, provider: str, inputs: list[str], outputs: list[str], train_test_split_value: float = None, model_config: dict = init_model_config):
    def get_evaluate(_model, _x_test, _y_test):
        if provider == 'sklearn':
            return _model.score(_x_test, _y_test)
        elif provider == 'keras':
            return _model.evaluate(_x_test, _y_test)
        else:
            return None
    # Split data
    _x = df[inputs]
    _y = df[outputs]
    if train_test_split_value is not None:
        _x_train, _x_test, _y_train, _y_test = train_test_split(
            _x, _y, test_size=train_test_split_value, random_state=0)
    else:
        _x_train = _x
        _y_train = _y
        _x_test = None
        _y_test = None
    _output_model = None
    # Training
    if provider == 'sklearn':
        if model == 'linear_regression':
            _model = LinearRegression()
            _model.fit(_x_train, _y_train)
            _output_model = _model
        if model == 'muliple_linear_regression':
            _model = LinearRegression()
            _model.fit(_x_train, _y_train)
            _output_model = _model
        elif model == 'logistic_regression':
            _model = LogisticRegression()
            _model.fit(_x_train, _y_train)
            _output_model = _model
    elif provider == 'keras':
        if model == 'neural_network':
            _model = Sequential()
            _model.add(Dense(len(inputs), input_dim=len(
                inputs), activation='relu'))
            _model.add(Dense(len(outputs), activation='sigmoid'))
            _model.compile(loss='mean_squared_error',
                           optimizer='sgd', metrics=['accuracy'])
            _model.fit(_x_train, _y_train, epochs=150, batch_size=10)
            _output_model = _model
    elif provider == 'numpy':
        if model == 'polynomial_regression':
            _model = poly1d(
                polyfit(_x_train, _y_train, model_config['degree']))
            _output_model = _model
    # Metrics
    if _x_test is not None and _y_test is not None:
        _result = {
            'model': _output_model,
            'metrics': {
                'accuracy': get_evaluate(_output_model, _x_test, _y_test)
            }
        }
    else:
        _result = {
            'model': _output_model,
            'metrics': None
        }
    return _result
