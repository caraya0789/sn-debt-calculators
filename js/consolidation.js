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

	$.fn.consolidationCalculator = function() {
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
			resizeClass(ww, 546, 'xs-1');
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
			$('.js-debt-payment', $parent).inputmask('currency', options.currency);
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

		var applyUIPlugins = function() {
			$('.js-debts-form .form-row a.delete', self).on('click', deleteDebt);
		};

		var deleteDebt = function() {
			$(this).parents('li').remove();
			if($('.js-debts-form .form-row').length == 1) {
				$('.js-debts-form .form-row:eq(0)').addClass('only');
			}
			return false;
		};

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

		var isMonthlyPaymentComplete = function() {
			var isComplete = true;
			$('.js-debts-form .form-row', self).each(function(){
				var value = parseFloat($('.js-debt-payment', this).inputmask('unmaskedvalue'));
				if(isNaN(value) || value == 0)
					isComplete = false;
			});
			return isComplete;
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
			$('.js-options', self).parent().removeClass('fill');

			$('.js-additional-info', self).slideUp().html('');
			$('.js-options', self).slideUp().html('');

			var info = {
				balance : getTotalDebt(),
				interest : getInterest(),
				payment : getTotalPayment(),
				debt_count : debt_count
			};

			if(isNaN(info.balance) || info.balance == 0 || isNaN(info.interest)) {
				$('.js-debt-amount', self).each(function(){
					var value = parseFloat($(this).inputmask('unmaskedvalue'));
					if(value == 0 || isNaN(value))
						$(this).addClass('error');
				});

				$('.js-debt-amount', self).keyup(function(){
					var value = parseFloat($(this).inputmask('unmaskedvalue'));
					if(value == 0 || isNaN(value))
						$(this).addClass('error');
					else
						$(this).removeClass('error');
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
			if(!isMonthlyPaymentComplete()) {
				$('.js-debt-payment', self).each(function(){
					var value = parseFloat($(this).inputmask('unmaskedvalue'));
					if(value == 0 || isNaN(value))
						$(this).addClass('error');
				});

				$('.js-debt-payment', self).keyup(function(){
					var value = parseFloat($(this).inputmask('unmaskedvalue'));
					if(value == 0 || isNaN(value))
						$(this).addClass('error');
					else
						$(this).removeClass('error');
				});

				alert('Please enter the Monthly Payment Amount for each debt.');
				return false;	
			}

			info.months = getRepayDebtMonths(info.balance, info.interest, info.payment);
			info.monthsCeil = Math.ceil(info.months);
			info.type = 'months';

			info.interestsPaid = getTotalInterestPaid();

			if(isNaN(info.months) || isNaN(info.payment)) {
				$('.js-debts-form .form-row', self).each(function() {
					var wrong_balance = parseFloat($('.js-debt-amount', this).inputmask('unmaskedvalue'));
					var wrong_interest = parseFloat($('.js-debt-interest', this).inputmask('unmaskedvalue'));
					var wrong_payment = parseFloat($('.js-debt-payment', this).inputmask('unmaskedvalue'));
					var months = getRepayDebtMonths(wrong_balance, wrong_interest, wrong_payment);
					if(isNaN(months)) {
						$('.js-debt-payment', this).addClass('error');

						$('.js-debt-payment', this).keyup(function(){
							var value = parseFloat($(this).inputmask('unmaskedvalue'));
							if(value == 0 || isNaN(value))
								$(this).addClass('error');
							else
								$(this).removeClass('error');
						});
					}
				});

				alert('The Monthly Payment is too low. Please enter a higher amount.');
				return false;
			}

			var newInterest = parseInt($('.js-new-interest').val());
			var newTerm = parseInt($('.js-new-term').val()) * 12;
			var newPayment = getRepayDebtPayment(info.balance, newInterest, newTerm);

			var newInterestPaid = getInterestPaid(newPayment, newInterest, info.balance, newTerm);

			var infoOptions = { 
				repay : info,
				consolidation:{
					balance : info.balance,
					interest: newInterest,
					payment : newPayment,
					months  : newTerm,
					monthsCeil  : Math.ceil(newTerm)
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

			var savings = (info.balance + info.interestsPaid) - (info.balance + newInterestPaid);
			if(savings < 0) {
				savings = 0;
			}

			$('.js-additional-info', self).parent().addClass('fill');
			$('.js-options', self).parent().addClass('fill');

			$('.js-additional-info', self).html(templates.additionalInfo.render(info)).stop().slideDown().addClass('active');
			$('.js-options', self).html(templates.options.render(infoOptions)).stop().slideDown().addClass('active');

			var chartData = {
				//labels: ["MINIMUM MONTHLY PAYMENTS", "DEBT CONSOLIDATION LOAN"],
				labels: ["", ""],
			    datasets: [{
		            label: "Balance",
		            backgroundColor: '#024789',
					hoverBackgroundColor : '#024789',
		            data: [info.balance,info.balance]
		        },{
		            label: "Interest",
		            backgroundColor: '#2f8eea',
					hoverBackgroundColor : '#2f8eea',
		            data: [
		            	info.interestsPaid,
		            	newInterestPaid
	            	]
		        }]
		    };

		    var $tooltipRelativeParent;
		    $('.calc-chart-tooltip').parents().each(function() {
		    	if(!$tooltipRelativeParent && $(this).css('position') == 'relative')
		    		$tooltipRelativeParent = $(this);
		    });
		    if($tooltipRelativeParent === undefined) {
		    	$tooltipRelativeParent = {
		    		offset:function() { return { top:0, left:0 }; }
		    	};
		    }

		    var firstAnimationFinish = false;
		    var barLabelOnHover = false;
		    var barLabelPositions = {
		    	top:[],
		    	left:[],
		    	width:[]
		    };

		    var calculateTooltipPositions = function(index) {
		    	if(!firstAnimationFinish)
		    		return;

		    	var offsetTop = $("#chart").offset().top - $tooltipRelativeParent.offset().top;
		    	var top = barLabelPositions.top[index];
		    	top = offsetTop + top;
		    	top = top - $('.calc-chart-tooltip').height() - 20;

		    	var left = barLabelPositions.left[index] - 20 + (barLabelPositions.width[index] / 2);
		    	left = left - ($('.calc-chart-tooltip').width() / 2);

		    	return {
		    		top:top,
		    		left:left
		    	};
		    	
		    };

		    var showCustomTooltip = function(index) {
		    	if(index == 0) {
					$('.calc-chart-tooltip-duration', '.calc-chart-tooltip').text(info.monthsCeil + ' months');
					$('.calc-chart-tooltip-paid', '.calc-chart-tooltip').text('Total Paid: ' + formatCurrency(info.balance + info.interestsPaid));
					$('.calc-chart-tooltip-savings', '.calc-chart-tooltip').text('Savings: $0');
				} else {
					$('.calc-chart-tooltip-duration', '.calc-chart-tooltip').text(newTerm + ' months');
					$('.calc-chart-tooltip-paid', '.calc-chart-tooltip').text('Total Paid: ' + formatCurrency(info.balance + newInterestPaid));
					$('.calc-chart-tooltip-savings', '.calc-chart-tooltip').text('Savings: ' + formatCurrency(savings));
				}
				$('.calc-chart-tooltip').show();
				$('.calc-chart-tooltip').css(calculateTooltipPositions(index));
		    }

			var ctx = $("#chart").get(0).getContext("2d");
			var myNewChart = new Chart(ctx, {
				type: 'bar',
				data: chartData,
				options: {
					legend: {
						display:false
					},
					tooltips: {
						enabled:false,
						backgroundColor:'transparent',
						footerFontSize:0,
						callbacks: {
							title: function() { return ''; },
							footer: function(tooltipItem, data) {   
								var foot = ['consolidation', 'current'];
								return foot[tooltipItem[0].index];
							},
							label: function(tooltipItem, data) {
								return formatCurrency(tooltipItem.yLabel);
							}
						},
						custom: function(tooltip) {
							if(barLabelOnHover)
								return;

							if(tooltip.title != undefined && tooltip.footer.indexOf('consolidation') !== -1) {
								showCustomTooltip(0);
							} else {
								showCustomTooltip(1);
							}
						},
		                xAlign:'top',
		                yAlign:'center',
		                xPadding:0,
		                yPadding:0
					},
					scales: {
		                xAxes: [{
	                        stacked: true,
	                        categoryPercentage:0.4,
	                        gridLines: {
	                        	display:false
	                        }
		                }],
		                yAxes: [{
	                        stacked: true,
	                        ticks : {
	                        	callback : function(value) {
	                        		return formatCurrency(value);
	                        	}
	                        }
		                }]
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
					                    var dataClass = '.js-data-'+element._datasetIndex+'-'+element._index;
					                	$(dataClass).text(formatCurrency(self.data.datasets[element._datasetIndex].data[element._index]));
					                	$(dataClass).css({
					                		top:(element._datasetIndex == 1) ? element._view.y + 5 : element._view.y + 25,
					                		left:element._view.x - (element._view.width / 2),
					                		width:element._view.width
					                	});
					                	$(dataClass).hover(function() {
					                		barLabelOnHover = true;
					                		showCustomTooltip(element._index);
					                	}, function() {
					                		barLabelOnHover = false;
					                	});
					                	if(element._datasetIndex == 1 && !firstAnimationFinish) {
					                		barLabelPositions.top[element._index] = element._view.y;
					                		barLabelPositions.left[element._index] = element._view.x;
					                		barLabelPositions.width[element._index] = element._view.width;
					                	}
					                }, self);
					            }
				            }, self);
				            if(!firstAnimationFinish) {
				            	firstAnimationFinish = true;
				            	showCustomTooltip(1);
				            }
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
			$('.js-toggler', self).on('click', toggleResultCallback);
			$('.js-calculate', self).on('click', calculate);
		};

		applyDebtsFormUIPlugins(self);
		applyUIPlugins();
		bindEvents();
	};

	$(function(){
		$('.js-consolidation-calc').consolidationCalculator();
	});

})( jQuery );

stLight.options({
	publisher: "5813bb2f-6156-4f6c-91ec-2dede743ff9e", 
	doNotHash: false, 
	doNotCopy: false, 
	hashAddressBar: false
});