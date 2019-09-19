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

	$.fn.incomeRatioCalculator = function() {
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
			percentage : {
				digits:2, 
				clearMaskOnLostFocus:false,
				rightAlign:false,
				placeholder:'',
				integerDigits:2,
				suffix:'%'
			}
		};

		var debt_count = 0;

		// Add templates
		var templates = {
			incomeFormItem : $.templates('#income-form-item-tpl'),
			debtFormItem : $.templates('#debt-form-item-tpl'),
			additionalInfo : $.templates('#additional-info-tpl'),
			options : $.templates('#options-tpl'),
		};

		var applyDebtsFormUIPlugins = function($parent) {
			// Use jquery ui select menu for selects;
			$('select', $parent).selectmenu();
			// Apply Masks
			$('.js-debt-amount', $parent).inputmask('currency', options.currency);
			$('.js-income-amount', $parent).inputmask('currency', options.currency);
			$('.js-tooltip', self).each(function(){
				var $el = $(this);

				var closeToltip = function(e) {
					if ($(e.target).closest($el).size()) 
			            return;
			        $('body').off('touchend', closeToltip);
        			$el.tooltip('close');
				};

				$el.tooltip({
					position: {
				        my: "bottom-10",
				        at: "left top"
			      	},
			      	open: function () {
			            $('body').on('touchend', closeToltip);
					}
				});
			});
		};

		var applyUIPlugins = function() {
			$('.js-debts-form .form-row a.delete', self).on('click', deleteDebt);
		};

		var deleteFormItem = function(el, parent) {
			$(el).parents('li').remove();
			if($('.form-row', parent).length == 1) {
				$('.form-row:eq(0)', parent).addClass('only');
			}
			return false;
		}

		var deleteDebt = function() {
			return deleteFormItem(this, '.js-debts-form');
		};

		var deleteIncome = function() {
			return deleteFormItem(this, '.js-income-form');
		};

		var addFormItem = function(template, parent, deleteCallback) {
			// Render template as jQuery object
			var $item = $(template.render());
			// Bind Event to delete row button
			$('a.delete', $item).on('click', deleteCallback);
			// Append New Debt Row to Form
			$(parent, self).append($item);
			applyDebtsFormUIPlugins($item);

			// Show delete link
			$('.form-row.only', parent).removeClass('only');
			return false;
		}

		var addNewDebt = function() {
			return addFormItem(templates.debtFormItem, '.js-debts-form', deleteDebt);
		};

		var addNewIncome = function() {
			return addFormItem(templates.incomeFormItem, '.js-income-form', deleteIncome);
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

		var getTotalDebt = function() {
			var debt = 0;
			debt_count = 0;
			$('.js-debts-form .form-row', self).each(function(){
				var value = parseFloat($('.js-debt-amount', this).inputmask('unmaskedvalue'));
				if(isNaN(value))
					value = 0;

				debt_count += (value == 0) ? 0 : 1;

				debt += value;
			});

			return parseFloat(debt.toFixed(2));
		};

		var getTotalIncome = function() {
			var income = 0;
			$('.js-income-form .form-row', self).each(function(){
				var value = parseFloat($('.js-income-amount', this).inputmask('unmaskedvalue'));
				if(isNaN(value))
					value = 0;

				income += value;
			});

			return parseFloat(income.toFixed(2));
		};

		var getTotalPayment = function() {
			var payment = 0;
			$('.js-debts-form .form-row', self).each(function(){
				var value = parseFloat($('.js-debt-payment', this).inputmask('unmaskedvalue'));
				if(isNaN(value))
					value = 0;

				payment += value;
			});

			return parseFloat(payment.toFixed(2));
		};

		var getInterest = function() {
			var interest = 0;
			var count = 0;
			$('.js-debts-form .form-row', self).each(function(){
				var value = parseFloat($('.js-debt-interest', this).inputmask('unmaskedvalue'));
				if(isNaN(value)) 
					value = 0;
				
				interest += value;
				count++;
			});

			return parseFloat((interest / count).toFixed(2));
		};

		var getRepayDebtPayment = function(pv, rate, nper) {
			var fv = 0;
			var type = 0;

			rate = (rate / 12) / 100;

			if (rate === 0) return (pv + fv)/nper;
			
			var pvif = Math.pow(1 + rate, nper);
			var pmt = rate / (pvif - 1) * (pv * pvif + fv);

			if (type == 1) {
				pmt /= (1 + rate);
			}

			return pmt;

			//return pmt.toFixed(0); 
		};

		var getRepayDebtMonths = function(present, rate, payment) {
			var type = 0;
			var future = 0;

			// Use monthly rate
			rate = (parseFloat(rate)/12) / 100;

			if(rate === 0) return Math.ceil(present / payment);

			// Payment should be negative;
			payment = 0-parseInt(payment);
			present = parseInt(present);

			// Return number of periods
			var num = payment * (1 + rate * type) - future * rate;
			var den = (present * rate + payment * (1 + rate * type));

			var result = Math.log(num / den) / Math.log(1 + rate);
			//return Math.ceil(result);
			return result;
		};

		var getInterestPaid = function(payment, interest, balance, periods) {
			payment = parseFloat(payment);
			interest = (interest / 100) / 12;
			balance = parseFloat(balance);
			var interestPaidTotal = 0.00;
			for(var i=0;i<periods;i++) {
				var interestPaid = interest * balance;
				var principal = payment - interestPaid;
				balance = balance - principal;

				interestPaidTotal += interestPaid;
			}
			return interestPaidTotal;
		};

		var getTotalInterestPaid = function() {
			var interestPaid = 0;
			$('.js-debts-form .form-row', self).each(function(){
				var payment = parseFloat($('.js-debt-payment', this).inputmask('unmaskedvalue'));
				if(isNaN(payment))
					return;

				var balance = parseFloat($('.js-debt-amount', this).inputmask('unmaskedvalue'));
				if(isNaN(balance))
					return;

				var interest = parseFloat($('.js-debt-interest', this).inputmask('unmaskedvalue'));
				if(isNaN(interest))
					interest = 0;

				var periods = Math.ceil(getRepayDebtMonths(balance, interest, payment));

				var value = getInterestPaid(payment, interest, balance, periods);

				interestPaid += value;
			});

			return parseFloat(interestPaid.toFixed(2));
		};

		var calculate = function() {
			$('.js-additional-info', self).parent().removeClass('fill');
			$('.js-additional-info', self).slideUp().html('');

			var info = {
				debt:getTotalDebt(),
				income:getTotalIncome()
			};

			if(info.income == 0) {
				$('.js-income-amount', self).addClass('error');
				$('.js-income-amount', self).keyup(function(){
					var value = parseFloat($(this).inputmask('unmaskedvalue'));
					if(value == 0 || isNaN(value))
						$(this).addClass('error');
					else
						$(this).removeClass('error');
				});

				alert("Please enter at least one income amount");
				return false;
			}

			if(info.debt > info.income) {
				$('.js-debt-amount', self).addClass('error');
				$('.js-debt-amount, .js-income-amount', self).keypress(function() {
					$('.js-debt-amount', self).removeClass('error');
				});
				alert("Monthly Debt Payments can't be greater than your Monthly Income.");
				return false;
			}

			info.ratio = parseFloat(((info.debt / info.income) * 100).toFixed(2));

			$('.js-additional-info', self).parent().addClass('fill');
			$('.js-additional-info', self).html(templates.additionalInfo.render(info)).stop().slideDown().addClass('active');

			var chartData = {
				labels: [
					parseFloat(100 - info.ratio).toFixed(2) + '%',
					info.ratio + '%'
				],
				datasets: [{
					data: [100 - info.ratio, info.ratio],
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

			return false;
		};

		var bindEvents = function() {
			$('.js-add-debt', self).on('click', addNewDebt);
			$('.js-add-income', self).on('click', addNewIncome);
			$('.js-toggler', self).on('click', toggleResultCallback);
			$('.js-calculate', self).on('click', calculate);
		};

		applyDebtsFormUIPlugins(self);
		applyUIPlugins();
		bindEvents();
	};

	$(function(){
		$('.js-incomeratio-calc').incomeRatioCalculator();
	});

})( jQuery );

stLight.options({
	publisher: "5813bb2f-6156-4f6c-91ec-2dede743ff9e", 
	doNotHash: false, 
	doNotCopy: false, 
	hashAddressBar: false
});