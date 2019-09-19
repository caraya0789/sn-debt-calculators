<div style="display:none" id="calc-container" class="calc-container js-consolidation-calc">
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
      <div class="col">
        <label>Monthly Payment <i title="Enter the minimum monthly payment for each debt. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
        <input placeholder="$" class="control js-debt-payment">
      </div>
    </li>
  </script>
  <script type="text/x-jsrender" id="additional-info-tpl">
    <h4>Your Payment Information</h4>
    <ul class="details">
      <li> <span>{{currency:balance}}</span>Balance</li>
      <li><span>{{currency:payment}}</span>Monthly Payment</li>
    </ul>
    <h4>Debt Consolidation Chart</h4>
    <div class="chart">
      <div class="chart-graph">
        <canvas id="chart" width="560" height="280"></canvas>
        <span class="chart-bar-label js-data-0-0">0 0</span>
        <span class="chart-bar-label js-data-0-1">0 1</span>
        <span class="chart-bar-label js-data-1-0">1 0</span>
        <span class="chart-bar-label js-data-1-1">1 1</span>
      </div>
      <ul class="chart-details">
        <li class="light-blue"><span class="circle"></span><span class="label">Interest Paid</span></li>
        <li class="blue"><span class="circle"></span><span class="label">Original Balance</span></li>
        <li class="orange"><span class="circle"></span><span class="label">Time to pay off balance</span></li>
      </ul>
      <ul class="chart-xAxis-labels">
        <li>MINIMUM MONTHLY PAYMENTS</li>
        <li>DEBT CONSOLIDATION LOAN</li>
      </ul>
    </div>
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
    DEBT CONSOLIDATION  <br> CALCULATOR
    <?php endif ?>
  </h3>
  <div class="calc-form">
    <ul class="calc-debts consolidation js-debts-form">
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
        <div class="col">
          <label>Monthly Payment <i title="Enter the minimum monthly payment for each debt. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
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
        <div class="col">
          <label>Monthly Payment <i title="Enter the minimum monthly payment for each debt. This can be found on your most recent statement." class="fa fa-question-circle js-tooltip"></i></label>
          <input placeholder="$" class="control js-debt-payment">
        </div>
      </li>
    </ul>
    <div class="form-row"><a href="#" class="calc-btn js-add-debt"> <i class="fa fa-plus"></i>Add New Debt</a></div>
    <div class="payment consolidation">
      <div class="form-row hidden-xs">
        <div class="col">choose Interest rate <i title="Select the interest rate of your future loan to calculate how much you can save by consolidating your debts." class="fa fa-question-circle js-tooltip"></i></div>
        <div class="col">choose term <i title="Choose the term length of your future loan to calculate how much you will need to pay each month." class="fa fa-question-circle js-tooltip"></i></div>
      </div>
      <div class="form-row">
        <div class="col">
          <label class="visible-xs">choose Interest rate <i title="Select the interest rate of your future loan to calculate how much you can save by consolidating your debts." class="fa fa-question-circle js-tooltip"></i></label>
          <select class="control js-new-interest">
            <?php for($i=12;$i<=20;$i++): ?>
            <option <?php echo ($i==12) ? 'selected' : '' ?> value="<?php echo $i ?>"><?php echo $i ?>%</option>
            <?php endfor ?>
          </select>
        </div>
        <div class="col">
          <label class="visible-xs">choose term <i title="Choose the term length of your future loan to calculate how much you will need to pay each month." class="fa fa-question-circle js-tooltip"></i></label>
          <select class="control js-new-term">
            <?php for($i=1;$i<=10;$i++): ?>
            <option <?php echo ($i==3) ? 'selected' : '' ?> value="<?php echo $i ?>"><?php echo $i ?> Year</option>
            <?php endfor ?>
          </select>
        </div>
      </div>
    </div><a href="#" class="calc-btn orange lg js-calculate">Calculate<i class="fa fa-angle-right"></i></a>
  </div>
  <div class="calc-results">
    <div class="calc-result">
      <h3 class="calc-result-title">Debt Repayment Information <a href="#" class="toggler js-toggler"><i class="fa fa-angle-down"></i></a></h3>
      <div class="calc-result-content js-additional-info consolidation"></div>
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