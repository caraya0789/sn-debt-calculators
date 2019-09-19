<div style="display:none" id="calc-container" class="calc-container js-creditcard-calc">
  <script type="text/x-jsrender" id="debt-form-item-tpl">
    <li class="form-row">
      <a href="#" class="delete">x</a>
      <div class="col first">
        <label>Debt Type</label>
        <select class="control js-debt-type">
          <option>Credit Card</option>
          <option>Automobile</option>
          <option>Line of Credit</option>
          <option>Overdraft</option>
          <option>Other Debt</option>
        </select>
      </div>
      <div class="col">
        <label>Current Balance <i title="Enter the total amount currently owing. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
        <input placeholder="$" class="control js-debt-amount">
      </div>
      <div class="col">
        <label>Interest Rate <i title="Enter the annual interest rate your currently paying. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
        <input placeholder="%" class="control js-debt-interest">
      </div>
    </li>
  </script>
  <script type="text/x-jsrender" id="additional-info-tpl">
    <h4>Your Payment Information</h4>
    <ul class="details">
      <li> <span>{{currency:balance}}</span>Balance</li>
      <li><span>{{:interest}}%</span>Annual Interest</li>
      <li><span>{{currency:minimun}}</span>Minimum Monthly Payment</li>
      <li><span>{{currency:additional}}</span>Additional Monthly Payment</li>
      <li><span>{{currency:payment}}</span>Fixed Monthly Payment</li>
    </ul>
    <h4>Credit Card Debt Repayment Chart</h4>
    <div class="chart">
      <div class="chart-graph">
        <canvas id="chart" width="560" height="280"></canvas>
        <span class="chart-bar-label js-data-0-0">0 0</span>
        <span class="chart-bar-label js-data-0-1">0 1</span>
        <span class="chart-bar-label js-data-0-2">0 2</span>
        <span class="chart-bar-label js-data-1-0">1 0</span>
        <span class="chart-bar-label js-data-1-1">1 1</span>
        <span class="chart-bar-label js-data-1-2">1 2</span>
      </div>
      <ul class="chart-details">
        <li class="light-blue"><span class="circle"></span><span class="label">Interest Paid</span></li>
        <li class="blue"><span class="circle"></span><span class="label">Original Balance</span></li>
        <li class="orange"><span class="circle"></span><span class="label">Time to pay off balance</span></li>
      </ul>
    </div>
    <span class="calc-option-label one">1</span>
    <span class="calc-option-label two">2</span>
    <span class="calc-option-label three">3</span>
  </script>
  <script type="text/x-jsrender" id="options-tpl">
    <table class="options">
      <thead>
        <tr>
          <th class="solution">Debt Solution</th>
          <th class="balance">Balance</th>
          <th class="interest">Interest <span><br> Rate</span></th>
          <th class="payment"><span class="one">Expected <br> Monthly Payment</span>
            <span class="two">Monthly Payment</span></th>
          <th class="payoff">Expected <br> Payoff Time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="solution">Repay Debt On Your Own <i title="Monthly payment amount for {{:repay.type=='months'?repay.monthsCeil+' months':repay.years+' years'}} assuming you will pay back {{currency:repay.balance}} in full at an {{:repay.debt_count > 1?'avg. ':''}}annual interest rate of {{:repay.interest}}%." class="fa fa-question-circle js-tooltip"></i></td>
          <td class="balance">{{currency:repay.balance}}</td>
          <td class="interest">{{:repay.interest}}%</td>
          <td class="payment">{{currency:repay.payment}}</td>
          <td class="payoff">{{:repay.type=='months'?repay.monthsCeil+' months':repay.years+' years'}}</td>
        </tr>
        <tr>
          <td class="solution">Debt Consolidation<i title="Monthly payment amount for {{:repay.type=='months'?consolidation.monthsCeil+' months':repay.years+' years'}} assuming you will pay back {{currency:consolidation.balance}} in full at an annual interest rate of {{:consolidation.interest}}%." class="fa fa-question-circle js-tooltip"></i></td>
          <td class="balance">{{currency:consolidation.balance}}</td>
          <td class="interest">{{:consolidation.interest}}%</td>
          <td class="payment">{{currency:consolidation.payment}}</td>
          <td class="payoff">{{:repay.type=='months'?consolidation.monthsCeil+' months':repay.years+' years'}}</td>
        </tr>
        <tr>
          <td class="solution">Credit Counselling<i title="Monthly payment amount for {{:repay.type=='months'?counselling.monthsCeil+' months':repay.years+' years'}} assuming you will pay back {{currency:repay.balance}} in full at an annual interest rate of 2.10%." class="fa fa-question-circle js-tooltip"></i></td>
          <td class="balance">{{currency:counselling.balance}}</td>
          <td class="interest">{{:counselling.interest}}%</td>
          <td class="payment">{{currency:counselling.payment}}</td>
          <td class="payoff">{{:repay.type=='months'?counselling.monthsCeil+' months':repay.years+' years'}}</td>
        </tr>
        <tr>
          <td class="solution">Consumer Proposal<i title="Monthly payment amount for {{:repay.type=='months'?proposal.monthsCeil+' months':repay.years+' years'}} assuming you will reduce your {{currency:repay.balance}} balance by 50% and pay the remaining balance in full." class="fa fa-question-circle js-tooltip"></i></td>
          <td class="balance">{{currency:proposal.balance}}</td>
          <td class="interest">{{:proposal.interest}}%</td>
          <td class="payment">{{currency:proposal.payment}}</td>
          <td class="payoff">{{:repay.type=='months'?proposal.monthsCeil+' months':repay.years+' years'}}</td>
        </tr>
        <tr>
          <td class="solution">Debt Settlement<i title="Monthly payment amount for {{:repay.type=='months'?settlement.monthsCeil+' months':repay.years+' years'}} assuming you will reduce your {{currency:repay.balance}} balance by 50% and pay the remaining balance in full." class="fa fa-question-circle js-tooltip"></i></td>
          <td class="balance">{{currency:settlement.balance}}</td>
          <td class="interest">{{:settlement.interest}}%</td>
          <td class="payment">{{currency:settlement.payment}}</td>
          <td class="payoff">{{:repay.type=='months'?settlement.monthsCeil+' months':repay.years+' years'}}</td>
        </tr>
      </tbody>
    </table>
    <div class="calc-bottom">
      <a href="http://www.debt.ca/debt-relief" class="calc-btn orange lg one">Get Your Free Savings Estimate<i class="fa fa-angle-right"></i></a>
      <p>Not sure which debt <br> solution  is right for you?</p>
      <a href="http://www.debt.ca/debt-relief" class="calc-btn orange lg two">Get Your Free Savings Estimate<i class="fa fa-angle-right"></i></a>
      <a href="http://www.debt.ca" class="calc-logo" target="_blank"><img src="/wp-content/uploads/2015/08/logo-footer.png"/></a>
    </div>
  </script>
  <h3 class="calc-title">
    <div class="calc-float-right">
      <span displayText="Facebook" class="st_facebook_vcount"></span>
      <span displayText="Google +" class="st_googleplus_vcount"></span>
      <span displayText="Tweet" class="st_twitter_vcount"></span>
    </div>
    <?php if(!empty($_GET['title'])): ?>
    <?php echo htmlentities($_GET['title']) ?>
    <?php else: ?>
    Credit Card Debt <br> Calculator
    <?php endif ?>
  </h3>
  <div class="calc-form">
    <ul class="calc-debts js-debts-form">
      <li class="form-header">
        <div class="col">
          <label>Debt Type</label>
        </div>
        <div class="col">
          <label>Current Balance <i title="Enter the total amount currently owing. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
        </div>
        <div class="col">
          <label>Interest Rate <i title="Enter the annual interest rate your currently paying. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
        </div>
      </li>
      <li class="form-row only">
        <a href="#" class="delete">x</a>
        <div class="col first">
        <label>Debt Type</label>
          <select class="control js-debt-type">
            <option>Credit Card</option>
            <option>Automobile</option>
            <option>Line of Credit</option>
            <option>Overdraft</option>
            <option>Other Debt</option>
          </select>
        </div>
        <div class="col">
          <label>Current Balance <i title="Enter the total amount currently owing. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
          <input placeholder="$" class="control js-debt-amount">
        </div>
        <div class="col">
          <label>Interest Rate <i title="Enter the annual interest rate your currently paying. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
          <input placeholder="%" class="control js-debt-interest">
        </div>
      </li>
    </ul>
    <div class="form-row"><a href="#" class="calc-btn js-add-debt"> <i class="fa fa-plus"></i>Add New Debt</a></div>
    <div class="payment creditcard">
      <div class="form-row">
        <div class="col">
          <span class="num">1</span>
          minimum monthly payment
          <i title="The Minimum Monthly Payment calculation is the percentage or formula used to determine the minimum payment requested on your credit card bill each month. This calculation should be specified in your Credit Card Agreement Disclosure or in your statement." class="fa fa-question-circle js-tooltip"></i>
        </div>
        <div class="col">
          <select class="control js-minimun-payment">
            <option value="">- Select an option -</option>
            <option selected value="minimun">Interest + 1% Balance</option>
            <option value="0.02">2%</option>
            <option value="0.0208">2.08%</option>
            <option value="0.025">2.5%</option>
            <option value="0.0278">2.78%</option>
            <option value="0.03">3%</option>
            <option value="0.035">3.5%</option>
            <option value="0.04">4%</option>
            <option value="0.045">4.5%</option>
            <option value="0.05">5%</option>
          </select>
        </div>
      </div>
      <div class="form-row trim">
        <div class="col">&nbsp;</div>
        <div class="col"><span class="or">or</span></div>
      </div>
      <div class="form-row">
        <div class="col">
          <span class="num">2</span>
          Additional monthly payment
          <i title="This is the extra money you are willing to spend to pay off your credit card in addition to the Minimum Monthly Payment." class="fa fa-question-circle js-tooltip"></i>
        </div>
        <div class="col additional-group">
          <input class="control js-additional-payment"> +
          <input class="control js-minimum" disabled="1">
        </div>
      </div>
      <div class="form-row trim">
        <div class="col">&nbsp;</div>
        <div class="col"><span class="or">or</span></div>
      </div>
      <div class="form-row">
        <div class="col">
          <span class="num">3</span>
          Fixed Monthly Payment
          <i title="This is a set amount of money you are willing to spend each month to pay off your credit card, regardless of the amount owed." class="fa fa-question-circle js-tooltip"></i>
        </div>
        <div class="col">
          <input class="control js-fixed-payment">
        </div>
      </div>
    </div><a href="#" class="calc-btn orange lg js-calculate">Calculate<i class="fa fa-angle-right"></i></a>
  </div>
  <div class="calc-results">
    <div class="calc-result">
      <h3 class="calc-result-title">Debt Repayment Information <a href="#" class="toggler js-toggler"><i class="fa fa-angle-down"></i></a></h3>
      <div class="calc-result-content js-additional-info creditcard"></div>
    </div>
    <div class="calc-result">
      <h3 class="calc-result-title">See Your Options <a href="#" class="toggler js-toggler"><i class="fa fa-angle-down"></i></a></h3>
      <div class="calc-result-content js-options"></div>
    </div>
  </div>
</div>
<div class="calc-chart-tooltip">
  <div class="calc-chart-tooltip-wrap">
    <div class="calc-chart-tooltip-duration">940 months</div>
    <div class="calc-chart-tooltip-paid">Total Paid: $150,000</div>
    <div class="calc-chart-tooltip-savings">Savings: $35,000</div>
  </div>
</div>