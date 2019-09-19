(function($){

	var formatNumber = function(rawNumber) {
		rawNumber += '';
		var numberAndDecimals = rawNumber.split('.');
		var number = numberAndDecimals[0];
		var decimals = numberAndDecimals.length > 1 ? '.' + numberAndDecimals[1] : '';
		decimals = (decimals != '' && decimals.length < 3) ? decimals + '0' : decimals;
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(number)) {
			number = number.replace(rgx, '$1' + ',' + '$2');
		}
		return number + decimals;
	};

	var formatCurrency = function(num) {
		var numStr = num+'';

		if(numStr.indexOf('.') != -1) {
			num = parseFloat(parseFloat(num).toFixed(2));
		}

		return '$'+formatNumber(num);
	}

	$.views.converters("currency", function(num) { 
		return formatCurrency(num);
	});

	$.fn.guiltCalculator = function() {
		if(this.length === 0)
			return;

		var self = this[0];

		// remove cloacking
		this.show();

		var resizeClass = function(width, limit, classname) {
			if(width < limit) {
				$(self).addClass(classname);
			} else {
				$(self).removeClass(classname);
			}
		};

		var resize = function() {
			var ww = $(self).width();
			
			resizeClass(ww, 680, 'md');
			resizeClass(ww, 600, 'sm');
			resizeClass(ww, 470, 'xs');
			resizeClass(ww, 350, 'xs-2');
			resizeClass(ww, 325, 'xs-3');
		};

		$(window).on('resize', resize);

		resize();

		// Use jquery ui select menu plugin
		var options = {
			currency: {
				digits:2,
				rightAlign:false,
				allowMinus:false
			},
			number : {
				digits:3, 
				clearMaskOnLostFocus:false,
				rightAlign:false,
				placeholder:'',
				integerDigits:3,
				allowMinus:false
			}
		};

		// Add templates
		var templates = {
			guiltItem : $.templates('#guilt-item-tpl'),
			additionalInfo : $.templates('#additional-info-tpl')
		};

		var getSingleTotalCost = function($parent) {
			var totalCost = 0;

			var cost = parseFloat($('.js-habit-cost', $parent).inputmask('unmaskedvalue'));
			if(isNaN(cost)) cost = 0;

			var qty = parseInt($('.js-habit-qty', $parent).inputmask('unmaskedvalue'));
			if(isNaN(qty)) qty = 0;

			var fq = $('.js-habit-fq', $parent).val();

			switch(fq) {
				case 'day':
					totalCost = cost * 365 * qty;
				break;
				case 'week':
					totalCost = cost * 52 * qty;
				break;
				case 'month':
					totalCost = cost * 12 * qty;
				break;
			}

			return totalCost;
		};

		var getSingleTotalSavings = function($parent) {
			var totalSavings = 0;

			var cost = parseFloat($('.js-habit-cost', $parent).inputmask('unmaskedvalue'));
			if(isNaN(cost)) cost = 0;

			var giveup = parseInt($('.js-habit-giveup', $parent).inputmask('unmaskedvalue'));
			if(isNaN(giveup)) giveup = 0;

			var fq = $('.js-habit-fq', $parent).val();

			switch(fq) {
				case 'day':
					totalSavings = cost * 365 * giveup;
				break;
				case 'week':
					totalSavings = cost * 52 * giveup;
				break;
				case 'month':
					totalSavings = cost * 12 * giveup;
				break;
			}

			return totalSavings;
		};

		var updateResult = function() {
			var $parent = $(this).parents('ul');
			$('.js-cost-of-habit', $parent).text(formatCurrency(getSingleTotalCost($parent)));
			$('.js-savings', $parent).text(formatCurrency(getSingleTotalSavings($parent)));
		};

		var updateGiveupPeriod = function() {
			var $parent = $(this).parents('.form-row');
			$('.js-giveup-period', $parent).text('per '+this.value);
		};

		var getTotalCost = function() {
			var cost = 0;
			$('.js-debts-form .calc-debts').each(function() {
				cost += getSingleTotalCost(this);
			});
			return cost;
		};

		var getTotalSavings = function() {
			var savings = 0;
			$('.js-debts-form .calc-debts').each(function() {
				savings += getSingleTotalSavings(this);
			});
			return savings;
		};

		var preventMax = function() {
			var $parent = $(this).parents('.form-row');
			var qty = parseInt($('.js-habit-qty', $parent).inputmask('unmaskedvalue'));
			var giveup = parseInt($(this).inputmask('unmaskedvalue'));
			if(giveup > qty)
				$(this).val(qty);
		}

		var applyDebtsFormUIPlugins = function($parent) {
			// Use jquery ui select menu for selects;
			$('select', $parent).selectmenu();
			// Apply Masks
			$('.js-habit-cost', $parent).inputmask('currency', options.currency);
			$('.js-habit-qty', $parent).inputmask('numeric', options.number);
			$('.js-habit-giveup', $parent).inputmask('numeric', options.number);
			// Live update results
			$('.js-habit-giveup', $parent).on('keyup', preventMax);
			$('.js-habit-cost', $parent).on('keyup', updateResult);
			$('.js-habit-qty', $parent).on('keyup', updateResult);
			$('.js-habit-giveup', $parent).on('keyup', updateResult);
			$('.js-habit-fq', $parent).on('selectmenuchange', updateResult);
			$('.js-habit-fq', $parent).on('selectmenuchange', updateGiveupPeriod);
		};

		var applyUIPlugins = function() {
			$('.js-debts-form .form-title a.delete', self).on('click', deleteDebt);
		};

		var deleteDebt = function() {
			$(this).parents('ul').remove();
			if($('.js-debts-form .calc-debts').length == 1) {
				$('.js-debts-form .calc-debts:eq(0)').addClass('only');
			}
			$('.js-debts-form .calc-debts label .num').each(function(idx) {
				$(this).text(idx + 1);
			});
			return false;
		};

		var addNewHabit = function() {
			var _index = $('.js-debts-form .calc-debts').length + 1;
			// Render template as jQuery object
			var $item = $(templates.guiltItem.render({ 
				habit : $(this).val(),
				index : _index
			}));
			// Bind Event to delete row button
			$('a.delete', $item).on('click', deleteDebt);
			// Append New Debt Row to Form
			$('.js-debts-form', self).append($item);
			applyDebtsFormUIPlugins($item);

			// Show delete link
			$('.js-debts-form .calc-debts.only').removeClass('only');

			// Reset select menu
			$(this).val('').selectmenu('refresh');
			return false;
		};

		var calculate = function() {
			$('.js-additional-info', self).parent().removeClass('fill');
			$('.js-additional-info', self).slideUp().html('');

			var info = {
				cost:getTotalCost(),
				savings:getTotalSavings()
			};

			if(info.cost == 0) {
				var habit_cost = parseFloat($('.js-habit-cost', self).inputmask('unmaskedvalue'));
				if(habit_cost == 0 || isNaN(habit_cost)) {
					$('.js-habit-cost', self).addClass('error');
					$('.js-habit-cost', self).keyup(function() {
						var habit_cost = parseFloat($('.js-habit-cost', self).inputmask('unmaskedvalue'));
						if(habit_cost == 0 || isNaN(habit_cost)) {
							$('.js-habit-cost', self).addClass('error');
						} else {
							$('.js-habit-cost', self).removeClass('error');
						}
					});
				}

				var habit_qty = parseInt($('.js-habit-qty', self).inputmask('unmaskedvalue'));
				if(habit_qty == 0 || isNaN(habit_qty)) {
					$('.js-habit-qty', self).addClass('error');
					$('.js-habit-qty', self).keyup(function() {
						var habit_qty = parseInt($('.js-habit-qty', self).inputmask('unmaskedvalue'));
						if(habit_qty == 0 || isNaN(habit_qty)) {
							$('.js-habit-qty', self).addClass('error');
						} else {
							$('.js-habit-qty', self).removeClass('error');
						}
					});
				}

				alert("Please enter at least one habit amount and quantity");
				return false;
			}

			var savingsPercent = (info.savings * 100) / info.cost;

			$('.js-additional-info', self).parent().addClass('fill');
			$('.js-additional-info', self).html(templates.additionalInfo.render(info)).stop().slideDown().addClass('active');

			var chartData = {
				labels: [
					formatCurrency(info.cost),
					formatCurrency(info.savings)
				],
				datasets: [{
					data: [100 - savingsPercent, savingsPercent],
					backgroundColor: ['#2f8eea', '#024789'],
					hoverBackgroundColor : ['#2f8eea', '#024789']
			    }]
			};

			var ctx = $("#chart").get(0).getContext("2d");
			var myNewChart = new Chart(ctx, {
				type: 'doughnut',
				data: chartData,
				options: {
					legend: {
						display:false
					},
					tooltips: {
						callbacks: {
							label : function(tooltipItem, data) {
								return data.labels[tooltipItem.index];
							}
						},
		                xAlign:'bottom',
		                yAlign:'center'
					},
		            hover: {
		            	animationDuration:0
		            },
					animation: {
						events:[],
						onComplete:function () {
				            var self = this;
				            var elementsArray = [];
				            Chart.helpers.each(self.data.datasets, function (dataset, datasetIndex) {
				            	for(var i in dataset._meta) {
					                Chart.helpers.each(dataset._meta[i].data, function (element, index) {
					                    var tooltip = new Chart.Tooltip({
					                        _chartInstance: self,
					                        _chart: self.chart,
					                        _data: self.data,
					                        _options: self.options,
					                        _active: [element]
					                    }, self);
					                    tooltip.update();
					                    tooltip.transition(Chart.helpers.easingEffects.linear).draw();
					                }, self);
					            }
				            }, self);
				        }
					}
				}
			});

			$('html, body').animate({
				scrollTop: $('.js-additional-info').offset().top - 130
	        }, 1000);
			return false;
		};

		var toggleResultCallback = function() {
			var $result = $(this).parents('.calc-result');
			var $content = $('.calc-result-content', $result);
			toggleResult($content);

			return false;
		};

		var toggleResult = function($element) {
			if($element.hasClass('active')) {
				$element.stop().slideUp().removeClass('active');
			} else {
				$element.stop().slideDown().addClass('active');
			}
		};

		var bindEvents = function() {
			$('.js-add-debt-select', self).on('selectmenuchange', addNewHabit);
			$('.js-toggler', self).on('click', toggleResultCallback);
			$('.js-calculate', self).on('click', calculate);
		};

		applyDebtsFormUIPlugins(self);
		applyUIPlugins();
		bindEvents();
	};

	$(function(){
		$('.js-guilt-calc').guiltCalculator();
	});

})( jQuery );

stLight.options({
	publisher: "5813bb2f-6156-4f6c-91ec-2dede743ff9e", 
	doNotHash: false, 
	doNotCopy: false, 
	hashAddressBar: false
});