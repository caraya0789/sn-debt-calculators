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

	$.fn.repayCalculator = function() {
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
			debtFormItem : $.templates('#debt-form-item-tpl'),
			additionalInfo : $.templates('#additional-info-tpl'),
			options : $.templates('#options-tpl'),
		};

		var applyDebtsFormUIPlugins = function($parent) {
			// Use jquery ui select menu for selects;
			$('select', $parent).selectmenu();
			// Apply Masks
			$('.js-debt-amount', $parent).inputmask('currency', options.currency);
			$('.js-debt-interest', $parent).inputmask('percentage', options.percentage);
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

		var deleteDebt = function() {
			$(this).parents('li').remove();
			if($('.js-debts-form .form-row').length == 1) {
				$('.js-debts-form .form-row:eq(0)').addClass('only');
			}
			return false;
		}

		var addNewDebt = function() {
			// Render template as jQuery object
			var $item = $(templates.debtFormItem.render());
			// Bind Event to delete row button
			$('a.delete', $item).on('click', deleteDebt);
			// Append New Debt Row to Form
			$('.js-debts-form', self).append($item);
			applyDebtsFormUIPlugins($item);

			// Show delete link
			$('.js-debts-form .form-row.only').removeClass('only');
			return false;
		};

		var applyUIPlugins = function() {
			$('.js-monthly-payment', self).inputmask('currency', options.currency);
			$('.js-payoff-timeframe', self).inputmask('9[99]', {
				placeholder:''
			});
			$('.js-debts-form .form-row a.delete', self).on('click', deleteDebt);
		};

		var clearPayoffTimeframe = function() {
			$('.js-payoff-timeframe', self).inputmask('setvalue', '');
		};

		var clearMonthlyPayment = function() {
			$('.js-monthly-payment', self).inputmask('setvalue', '');
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

		var isInterestComplete = function() {
			var isComplete = true;
			$('.js-debts-form .form-row', self).each(function(){
				var value = parseFloat($('.js-debt-interest', this).inputmask('unmaskedvalue'));
				if(isNaN(value) || value == 0)
					isComplete = false;
			});
			return isComplete;
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

		var calculate = function() {
			$('.js-additional-info', self).parent().removeClass('fill');
			$('.js-options', self).parent().removeClass('fill');

			$('.js-additional-info', self).slideUp().html('');
			$('.js-options', self).slideUp().html('');

			var info = {
				balance : getTotalDebt(),
				interest : getInterest(),
				debt_count : debt_count
			};

			if(isNaN(info.balance) || info.balance == 0 || isNaN(info.interest)) {
				$('.js-debt-amount', self).addClass('error');
				$('.js-debt-amount', self).keypress(function(){
					if(parseFloat($(this).inputmask('unmaskedvalue')) != 0)
						$('.js-debt-amount', self).removeClass('error');
				});
				alert('Please enter the Current Balance amounts for each debt.');
				return false;
			}

			if(!isInterestComplete()) {
				$('.js-debt-interest', self).each(function(){
					if($(this).inputmask('unmaskedvalue') == null)
						$(this).addClass('error');
				});

				$('.js-debt-interest', self).keyup(function(){
					if($(this).inputmask('unmaskedvalue') != null)
						$(this).removeClass('error');
					else
						$(this).addClass('error');
				});

				alert('Please enter the Interest Rate for each balance.');
				return false;	
			}

			if($('.js-payoff-timeframe', self).val()) {
				if($('.js-payoff-time-type').val() != 'Months') {
					info.months = parseInt($('.js-payoff-timeframe', self).val()) * 12;
					info.monthsCeil = info.months;
					info.years = parseInt($('.js-payoff-timeframe', self).val());
					info.type = 'years';
				}
				else {
					info.months = parseInt($('.js-payoff-timeframe', self).val());
					info.monthsCeil = info.months;
					info.type = 'months';
				}

				info.payment = getRepayDebtPayment(info.balance, info.interest, info.months);

				var infoOptions = { 
					repay : info,
					consolidation:{
						balance : info.balance,
						interest: 12.00,
						payment : getRepayDebtPayment(info.balance, 12.00, info.months),
						months  : info.months,
						monthsCeil  : info.months
					},
					counselling: {
						balance : info.balance,
						interest: 2.10,
						payment : getRepayDebtPayment(info.balance, 2.10, info.months),
						months  : info.months,
						monthsCeil  : info.months
					},
					proposal: {
						balance : info.balance * 0.5,
						interest: 0.00,
						payment : getRepayDebtPayment(info.balance * 0.5, 0, info.months),
						months  : info.months,
						monthsCeil  : info.months
					},
					settlement: {
						balance : info.balance * 0.5,
						interest: 0.00,
						payment : getRepayDebtPayment(info.balance * 0.5, 0, info.months),
						months  : info.months,
						monthsCeil  : info.months
					}
				};

			} else if($('.js-monthly-payment', self).val()) {
				info.payment = $('.js-monthly-payment').inputmask('unmaskedvalue');
				info.months = getRepayDebtMonths(info.balance, info.interest, info.payment);
				info.monthsCeil = Math.ceil(info.months);
				info.type = 'months';
				var infoOptions = { 
					repay : info,
					consolidation:{
						balance : info.balance,
						interest: 12.00,
						payment : info.payment,
						months  : getRepayDebtMonths(info.balance, 12.00, info.payment),
						monthsCeil  : Math.ceil(getRepayDebtMonths(info.balance, 12.00, info.payment))
					},
					counselling: {
						balance : info.balance,
						interest: 2.10,
						payment : info.payment,
						months  : getRepayDebtMonths(info.balance, 2.10, info.payment),
						monthsCeil  : Math.ceil(getRepayDebtMonths(info.balance, 2.10, info.payment))
					},
					proposal: {
						balance : info.balance * 0.5,
						interest: 0.00,
						payment : info.payment,
						months  : getRepayDebtMonths(info.balance * 0.5, 0, info.payment),
						monthsCeil  : Math.ceil(getRepayDebtMonths(info.balance * 0.5, 0, info.payment))
					},
					settlement: {
						balance : info.balance * 0.5,
						interest: 0.00,
						payment : info.payment,
						months  : getRepayDebtMonths(info.balance * 0.5, 0, info.payment),
						monthsCeil  : Math.ceil(getRepayDebtMonths(info.balance * 0.5, 0, info.payment))
					}
				};

			} else {
				$('.js-payoff-timeframe, .js-monthly-payment', self).addClass('error');
				$('.js-payoff-timeframe, .js-monthly-payment', self).keypress(function(){
					$('.js-payoff-timeframe, .js-monthly-payment', self).removeClass('error');
				});
				alert('Please enter an Expected Monthly Payment or Desired Payoff Timeframe.');
				return false;
			}

			if(isNaN(info.months) || isNaN(info.payment)) {
				$('.js-monthly-payment', self).addClass('error');
				$('.js-payoff-timeframe, .js-monthly-payment', self).keypress(function(){
					$('.js-payoff-timeframe, .js-monthly-payment', self).removeClass('error');
				});
				alert('The Expected Monthly Payment is too low. Please enter a higher amount.');
				return false;
			}

			info.interestsPaid = getInterestPaid(info.payment, info.interest, info.balance, info.monthsCeil);

			$('.js-additional-info', self).parent().addClass('fill');
			$('.js-options', self).parent().addClass('fill');

			$('.js-additional-info', self).html(templates.additionalInfo.render(info)).stop().slideDown().addClass('active');
			$('.js-options', self).html(templates.options.render(infoOptions)).stop().slideDown().addClass('active');

			var chartData = {
				labels: [
					parseFloat((info.balance / (info.balance + info.interestsPaid)) * 100).toFixed(2) + '%',
					parseFloat((info.interestsPaid / (info.balance + info.interestsPaid)) * 100).toFixed(2) + '%'
				],
				datasets: [{
					data: [info.balance, info.interestsPaid],
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

			$('html, body').animate({
				scrollTop: $('.js-additional-info').offset().top - 130
	        }, 1000);

			return false;
		};

		var bindEvents = function() {
			$('.js-add-debt', self).on('click', addNewDebt);
			$('.js-monthly-payment', self).on('keypress', clearPayoffTimeframe);
			$('.js-payoff-timeframe', self).on('keypress', clearMonthlyPayment);
			$('.js-toggler', self).on('click', toggleResultCallback);
			$('.js-calculate', self).on('click', calculate);
		};

		applyDebtsFormUIPlugins(self);
		applyUIPlugins();
		bindEvents();

		// Return this by convension
		return this;
	};

	$(function(){
		$('.js-repay-calc').repayCalculator();
	});

})( jQuery );

stLight.options({
	publisher: "5813bb2f-6156-4f6c-91ec-2dede743ff9e", 
	doNotHash: false, 
	doNotCopy: false, 
	hashAddressBar: false
});