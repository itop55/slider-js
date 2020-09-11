'use script';
var sliderTarho = ((function () {
    return function (selector) {

        function getElemWidth(elem) {
            return parseFloat(getComputedStyle(elem).width)
        }

        var tarhoMainElem = document.querySelector(selector),// основный элемент блока
            tarhoPosLeftItem = 0,// позиция левого активного элемента
            tarhoTransform = -100,// значение трансформации .slider_wrapper
            tarhoItemsArr = [],// массив элементов
            tarhoStartX = 0,
            tarhoIndexIndicator = 0,
            tarhoIndicatorItems;

        if (tarhoMainElem) {
            var tarhoWrapperElem = tarhoMainElem.querySelector('.slider__wrapper');// обертка для .slider-item
            var tarhoControls = tarhoMainElem.querySelectorAll('.slider__control'),// элементы управления
                tarhoControlsLeft = tarhoMainElem.querySelector('.slider__control_left'),// кнопка "LEFT"
                tarhoControlsRight = tarhoMainElem.querySelector('.slider__control_right');// кнопка "RIGHT"

            if (tarhoWrapperElem) {
                var tarhoWrapperWidth = getElemWidth(tarhoWrapperElem);// ширина обёртки
            }

            if (tarhoWrapperElem) {
                var tarhoItems = tarhoWrapperElem.querySelectorAll('.slider__item');// элементы (.slider-item)
                var tarhoMaxIndexIndicator = tarhoItems.length - 1;

                if (tarhoItems.length) {
                    var tarhoItemWidth = getElemWidth(tarhoItems[0])
                }
            }

            if (tarhoWrapperWidth && tarhoItemWidth) {
                var tarhoStep = tarhoItemWidth / tarhoWrapperWidth * 100;// величина шага (для трансформации)
            }

            // наполнение массива _items
            tarhoItems.forEach(function (elem, index) {
                tarhoItemsArr.push({
                    item: elem,
                    position: index,
                    transform: 0
                })
            })

            var tarhoPosition = {
                getItemMin: function () {
                    var indexItem = 0;
                    tarhoItemsArr.forEach(function (item, index) {
                        if (item.position < tarhoItemsArr[indexItem].position) {
                            indexItem = index;
                        }
                    });
                    return indexItem;
                },
                getItemMax: function () {
                    var indexItem = 0;
                    tarhoItemsArr.forEach(function (item, index) {
                        if (item.position > tarhoItemsArr[indexItem].position) {
                            indexItem = index;
                        }
                    });
                    return indexItem;
                },
                getMin: function () {
                    return tarhoItemsArr[tarhoPosition.getItemMin()].position;
                },
                getMax: function () {
                    return tarhoItemsArr[tarhoPosition.getItemMax()].position;
                }
            }

            var tarhoItemTransform = function (dir) {
                var nextItem, currentIndicator = tarhoIndexIndicator;
                if (dir === 'right') {
                    tarhoPosLeftItem++;
                    if ((tarhoPosLeftItem + tarhoWrapperWidth / tarhoItemWidth - 1) > tarhoPosition.getMax() - 2) {
                        nextItem = tarhoPosition.getItemMin();
                        tarhoItemsArr[nextItem].position = tarhoPosition.getMax() + 1;
                        tarhoItemsArr[nextItem].transform += tarhoItemsArr.length * 100;
                        tarhoItemsArr[nextItem].item.style.transform = 'translateX(' + tarhoItemsArr[nextItem].transform + '%)';
                    }

                    tarhoTransform -= tarhoStep;
                    tarhoIndexIndicator++;

                    if (tarhoIndexIndicator > tarhoMaxIndexIndicator) {
                        tarhoIndexIndicator = 0;
                    }

                    // Добовляем класс к активному слайду
                    tarhoItems[tarhoIndexIndicator].classList.remove('active');
                    if(tarhoIndexIndicator === tarhoMaxIndexIndicator) {
                        tarhoItems[0].classList.add('active');
                    } else {
                        tarhoItems[tarhoIndexIndicator  + 1].classList.add('active');
                    }
                }

                if (dir === 'left') {
                    tarhoPosLeftItem--;
                    if (tarhoPosLeftItem < tarhoPosition.getMin() + 1) {
                        nextItem = tarhoPosition.getItemMax();
                        tarhoItemsArr[nextItem].position = tarhoPosition.getMin() - 1;
                        tarhoItemsArr[nextItem].transform -= tarhoItemsArr.length * 100;
                        tarhoItemsArr[nextItem].item.style.transform = 'translateX(' + tarhoItemsArr[nextItem].transform + '%)';
                    }

                    // Добовляем класс к активному слайду
                    if(tarhoIndexIndicator === tarhoMaxIndexIndicator) {
                        tarhoItems[0].classList.remove('active');
                        tarhoItems[tarhoMaxIndexIndicator].classList.add('active');
                    } else {
                        tarhoItems[tarhoIndexIndicator + 1].classList.remove('active');
                        tarhoItems[tarhoIndexIndicator].classList.add('active');
                    }

                    tarhoTransform += tarhoStep;
                    tarhoIndexIndicator--;

                    if (tarhoIndexIndicator < 0) {
                        tarhoIndexIndicator = tarhoMaxIndexIndicator;
                    }


                }

                tarhoWrapperElem.style.transform = 'translateX(' + tarhoTransform + '%)';
                tarhoIndicatorItems[currentIndicator].classList.remove('active');
                tarhoIndicatorItems[tarhoIndexIndicator].classList.add('active');

            }

            var tarhoSlideTo = function (to) {
                var i = 0, direction;

                if(to > tarhoIndexIndicator) {
                    direction = 'right';
                } else {
                    direction = 'left';
                }

                while (to !== tarhoIndexIndicator && i <= tarhoMaxIndexIndicator) {
                    tarhoItemTransform(direction);
                    i++;
                }
            }

            var tarchoIsTouchDevice = function () {
                return !!('ontouchstart' in window || navigator.maxTouchPoints);
            };

            // обработчик события click для кнопок "назад" и "вперед"
            var tarhoControlClick = function (e) {
                if (e.target.classList.contains('slider__control')) {
                    e.preventDefault();
                    if (e.target.classList.contains('slider__control_right')) {
                        tarhoItemTransform('right');
                    } else {
                        tarhoItemTransform('left');
                    }
                }
                if (e.target.getAttribute('data-slide-to')) {
                    tarhoSlideTo(parseInt(e.target.getAttribute('data-slide-to')));
                }
            }

            // добавление к кнопкам "назад" и "вперед" обработчика _controlClick для события click
            var tarhoAddListeners = function () {
                tarhoMainElem.addEventListener('click', tarhoControlClick);





                if (tarchoIsTouchDevice()) {
                    tarhoMainElem.addEventListener('touchstart', function (e) {
                        tarhoStartX = e.changedTouches[0].clientX;
                    });
                    tarhoMainElem.addEventListener('touchend', function (e) {
                        var
                            _endX = e.changedTouches[0].clientX,
                            _deltaX = _endX - tarhoStartX;
                        if (_deltaX > 50) {
                            tarhoItemTransform('left');
                        } else if (_deltaX < -50) {
                            tarhoItemTransform('right');
                        }
                    });
                } else {
                    tarhoMainElem.addEventListener('mousedown', function (e) {
                        tarhoStartX = e.clientX;
                    });
                    tarhoMainElem.addEventListener('mouseup', function (e) {
                        var
                            _endX = e.clientX,
                            _deltaX = _endX - tarhoStartX;
                        if (_deltaX > 50) {
                            tarhoItemTransform('left');
                        } else if (_deltaX < -50) {
                            tarhoItemTransform('right');
                        }
                    });
                }
            }

            var tarhoAddIndicators = function () {
                var sliderIndicators = document.createElement('ol');
                sliderIndicators.classList.add('slider__indicators');
                for (var i = 0; i < tarhoItems.length; i++) {
                    var sliderIndicatorsItem = document.createElement('li');
                    if (i === 0) {
                        sliderIndicatorsItem.classList.add('active');
                    }
                    sliderIndicatorsItem.setAttribute("data-slide-to", i);
                    sliderIndicators.appendChild(sliderIndicatorsItem);
                }
                tarhoMainElem.appendChild(sliderIndicators);
                tarhoIndicatorItems = tarhoMainElem.querySelectorAll('.slider__indicators > li')
            }

            // добавляем индикаторы
            tarhoAddIndicators();

            // инициализация
            tarhoAddListeners();
        }
    }
})());

sliderTarho('.slider');