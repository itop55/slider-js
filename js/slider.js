'use strict';
var slideShow = (function () {
    return function (selector, config) {
        var
            _slider = document.querySelector(selector), // основный элемент блока
            _sliderContainer = _slider.querySelector('.slider__items'), // контейнер для .slider-item
            _sliderItems = _slider.querySelectorAll('.slider__item'), // коллекция .slider-item
            _sliderControls = _slider.querySelectorAll('.slider__control'), // элементы управления
            _currentPosition = 0, // позиция левого активного элемента
            _transformValue = 0, // значение транфсофрмации .slider_wrapper
            _transformStep = 100, // величина шага (для трансформации)
            _itemsArray = [], // массив элементов
            _timerId,
            _indicatorItems,
            _indicatorIndex = 0,
            _indicatorIndexMax = _sliderItems.length - 1,
            _stepTouch = 50,
            _config = {};

        // настройка конфигурации слайдера в зависимости от полученных ключей
        for (var key in config) {
            if (key in _config) {
                _config[key] = config[key];
            }
        }

        // наполнение массива _itemsArray
        for (var i = 0, length = _sliderItems.length; i < length; i++) {
            _itemsArray.push({ item: _sliderItems[i], position: i, transform: 0 });
        }

        // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
        var position = {
            getItemIndex: function (mode) {
                var index = 0;
                for (var i = 0, length = _itemsArray.length; i < length; i++) {
                    if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') || (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
                        index = i;
                    }
                }
                return index;
            },
            getItemPosition: function (mode) {
                return _itemsArray[position.getItemIndex(mode)].position;
            }
        };

        // функция, выполняющая смену слайда в указанном направлении
        var _move = function (direction) {
            var nextItem, currentIndicator = _indicatorIndex;;
            if (direction === 'next') {
                _currentPosition++;
                if (_currentPosition > position.getItemPosition('max')) {
                    nextItem = position.getItemIndex('min');
                    _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
                    _itemsArray[nextItem].transform += _itemsArray.length * 100;
                    _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
                }
                _transformValue -= _transformStep;
                _indicatorIndex = _indicatorIndex + 1;
                if (_indicatorIndex > _indicatorIndexMax) {
                    _indicatorIndex = 0;
                }
            } else {
                _currentPosition--;
                if (_currentPosition < position.getItemPosition('min')) {
                    nextItem = position.getItemIndex('max');
                    _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
                    _itemsArray[nextItem].transform -= _itemsArray.length * 100;
                    _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
                }
                _transformValue += _transformStep;
                _indicatorIndex = _indicatorIndex - 1;
                if (_indicatorIndex < 0) {
                    _indicatorIndex = _indicatorIndexMax;
                }
            }
            _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
            _indicatorItems[currentIndicator].classList.remove('active');
            _indicatorItems[_indicatorIndex].classList.add('active');
        };

        // функция, осуществляющая переход к слайду по его порядковому номеру
        var _moveTo = function (index) {
            var i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
            while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
                _move(direction);
                i++;
            }
        };

        // функция, отключающая автоматическую смену слайдов
        var _stopAutoplay = function () {
            clearInterval(_timerId);
        };

        // функция, добавляющая индикаторы к слайдеру
        var _addIndicators = function () {
            var indicatorsContainer = document.createElement('ol');
            indicatorsContainer.classList.add('slider__indicators');
            for (var i = 0, length = _sliderItems.length; i < length; i++) {
                var sliderIndicatorsItem = document.createElement('li');
                if (i === 0) {
                    sliderIndicatorsItem.classList.add('active');
                }
                sliderIndicatorsItem.setAttribute("data-slide-to", i);
                indicatorsContainer.appendChild(sliderIndicatorsItem);
            }
            _slider.appendChild(indicatorsContainer);
            _indicatorItems = _slider.querySelectorAll('.slider__indicators > li')
        };

        // функция, осуществляющая установку обработчиков для событий
        var _setUpListeners = function () {
            var _startX = 0;

            _slider.addEventListener('touchstart', function (e) {
                _startX = e.changedTouches[0].clientX;
            });
            _slider.addEventListener('touchend', function (e) {
                var
                    _endX = e.changedTouches[0].clientX,
                    _deltaX = _endX - _startX;
                if (_deltaX > _stepTouch) {
                    _move('prev');
                } else if (_deltaX < -_stepTouch) {
                    _move('next');
                }
            });

            _slider.addEventListener('click', function (e) {
                if (e.target.classList.contains('slider__control')) {
                    e.preventDefault();
                    _move(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
                } else if (e.target.getAttribute('data-slide-to')) {
                    e.preventDefault();
                    _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
                }
            });

        };

        // добавляем индикаторы к слайдеру
        _addIndicators();
        // установливаем обработчики для событий
        _setUpListeners();
    }
}());

slideShow('#slider-1');
slideShow('#slider-2');