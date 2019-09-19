<div style="display:none" id="calc-container" class="calc-container js-incomeratio-calc">
  <script type="text/x-jsrender" id="income-form-item-tpl">
    <li class="form-row">
      <a href="#" class="delete">x</a>
      <div class="col first">
      <label>Monthly Income <i title="Enter in the total amount of income you are making each month." class="fa fa-question-circle js-tooltip"></i></label>
        <select class="control js-income-type">
          <option>Your Monthly Income</option>
          <option>Spouse's Monthly Income</option>
          <option>Alimony / Child Support</option>
          <option>Pension / Retirement Benefits</option>
          <option>Government Assistance</option>
          <option>Other Income</option>
        </select>
      </div>
      <div class="col">
        <label>Amount</label>
        <input placeholder="$" class="control js-income-amount">
      </div>
    </li>
  </script>
  <script type="text/x-jsrender" id="debt-form-item-tpl">
    <li class="form-row only">
      <a href="#" class="delete">x</a>
      <div class="col first">
      <label>Monthly Debt Payments <i title="Enter in the total amount of the payments you are making each month." class="fa fa-question-circle js-tooltip"></i></label>
        <select class="control js-debt-type">
          <option>Rent / Mortgage</option>
          <option>Car Loan</option>
          <option>Car Insurance</option>
          <option>Health Insurance</option>
          <option>Alimony / Child Support</option>
          <option>Credit Cards</option>
          <option>Student Loan</option>
          <option>Medical / Dental Bills</option>
          <option>Appliance / Furniture</option>
          <option>Other Payments</option>
        </select>
      </div>
      <div class="col">
        <label>Amount</label>
        <input placeholder="$" class="control js-debt-amount">
      </div>
    </li>
  </script>
  <script type="text/x-jsrender" id="additional-info-tpl">
    <h4>Debt to Income Ratio Chart</h4>
    <div class="chart">
      <div class="chart-graph">
        <canvas id="chart" width="125" height="125"></canvas>
      </div>
      <ul class="chart-details">
        <li class="light-blue"><span class="circle"></span><span class="label">Total Income</span><span class="value">{{currency:income}}</span></li>
        <li class="blue"><span class="circle"></span><span class="label">Total Debts</span><span class="value">{{currency:debt}}</span></li>
        <li class="orange"><span class="circle"></span><span class="label">Debt Ratio</span><span class="value">{{:ratio}}%</span></li>
      </ul>
    </div>
    <div class="calc-info">
      <p><strong>36% or less: Good.</strong> Most lenders consider a ratio of 36% or less a healthy debt load.</p>
      <p><strong>37-42%: Manageable.</strong> While you may be able to manage with a ratio this high, it is a good idea to start working to reduce your debt now and make sure you have adequate savings set aside for emergencies.</p>
      <p><strong>43-49%: Cause for Concern.</strong> Now would be a good time to make a household debt management plan to start paying down your debts to avoid trouble down the road. Talking to an expert is the best way to get tailored advice and get out of debt faster. </p>
      <p><strong>50% or more: Dangerous.</strong> You should make a plan to aggressively pay off your debts. At this level you may want to consider seeking professional help to severely reduce your debt.</p>
    </div>
    <div class="calc-bottom">
      <a href="http://www.debt.ca/debt-relief" class="calc-btn orange lg one">Get Your Free Savings Estimate<i class="fa fa-angle-right"></i></a>
      <p>Not sure which debt <br> solution  is right for you?</p>
      <a href="http://www.debt.ca/debt-relief" class="calc-btn orange lg two">Get Your Free Savings Estimate<i class="fa fa-angle-right"></i></a>
      <a href="http://www.debt.ca" class="calc-logo" target="_blank"><img src="/wp-content/uploads/2015/08/logo-footer.png"/></a>
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
          <td class="solution">Repay Debt On Your Own {{:repay.type}} <i title="Monthly payment amount for {{:repay.type=='months'?repay.monthsCeil+' months':repay.years+' years'}} assuming you will pay back {{currency:repay.balance}} in full at an {{:repay.debt_count > 1?'avg. ':''}}annual interest rate of {{:repay.interest}}%." class="fa fa-question-circle js-tooltip"></i></td>
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
          <td class="solution">Credit Counselling counselling<i title="Monthly payment amount for {{:repay.type=='months'?counselling.monthsCeil+' months':repay.years+' years'}} assuming you will pay back {{currency:repay.balance}} in full." class="fa fa-question-circle js-tooltip"></i></td>
          <td class="balance">{{currency:counselling.balance}}</td>
          <td class="interest">{{:counselling.interest}}%</td>
          <td class="payment">{{currency:counselling.payment}}</td>
          <td class="payoff">{{:repay.type=='months'?counselling.monthsCeil+' months':repay.years+' years'}}</td>
        </tr>
        <tr>
          <td class="solution">Consumer Proposal<i title="Monthly payment amount for {{:repay.type=='months'?proposal.monthsCeil+' months':repay.years+' years'}} assuming you will pay back 50% of {{currency:repay.balance}} in full." class="fa fa-question-circle js-tooltip"></i></td>
          <td class="balance">{{currency:proposal.balance}}</td>
          <td class="interest">{{:proposal.interest}}%</td>
          <td class="payment">{{currency:proposal.payment}}</td>
          <td class="payoff">{{:repay.type=='months'?proposal.monthsCeil+' months':repay.years+' years'}}</td>
        </tr>
        <tr>
          <td class="solution">Debt Settlement<i title="Monthly payment amount for {{:repay.type=='months'?settlement.monthsCeil+' months':repay.years+' years'}} assuming you will pay back 45% of {{currency:repay.balance}} in full." class="fa fa-question-circle js-tooltip"></i></td>
          <td class="balance">{{currency:settlement.balance}}</td>
          <td class="interest">{{:settlement.interest}}%</td>
          <td class="payment">{{currency:settlement.payment}}</td>
          <td class="payoff">{{:repay.type=='months'?settlement.monthsCeil+' months':repay.years+' years'}}</td>
        </tr>
      </tbody>
    </table>
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
    Debt to Income Ratio <br> Calculator
    <?php endif ?>
  </h3>
  <div class="calc-form">
    <ul class="calc-debts incomeratio income js-income-form">
      <li class="form-header">
        <div class="col">
          <label>Monthly Income <i title="Enter in the total amount of income you are making each month." class="fa fa-question-circle js-tooltip"></i></label>
        </div>
      </li>
      <li class="form-row only">
        <a href="#" class="delete">x</a>
        <div class="col first">
        <label>Montly Income <i title="Enter in the total amount of income you have making each month." class="fa fa-question-circle js-tooltip"></i></label>
          <select class="control js-income-type">
            <option>Your Monthly Income</option>
            <option>Spouse's Monthly Income</option>
            <option>Alimony / Child Support</option>
            <option>Pension / Retirement Benefits</option>
            <option>Government Assistance</option>
            <option>Other Income</option>
          </select>
        </div>
        <div class="col">
          <label>Amount</label>
          <input placeholder="$" class="control js-income-amount">
        </div>
      </li>
    </ul>
    <div class="form-row"><a href="#" class="calc-btn js-add-income"> <i class="fa fa-plus"></i>Add Monthly Income</a></div>
    <ul class="calc-debts incomeratio debt js-debts-form">
      <li class="form-header">
        <div class="col">
          <label>Monthly Debt Payments <i title="Enter in the total amount of the payments you are making each month." class="fa fa-question-circle js-tooltip"></i></label>
        </div>
      </li>
      <li class="form-row only">
        <a href="#" class="delete">x</a>
        <div class="col first">
        <label>Monthly Debt Payments <i title="Enter in the total amount of the payments you are making each month." class="fa fa-question-circle js-tooltip"></i></label>
          <select class="control js-debt-type">
            <option>Rent / Mortgage</option>
            <option>Car Loan</option>
            <option>Car Insurance</option>
            <option>Health Insurance</option>
            <option>Alimony / Child Support</option>
            <option>Credit Cards</option>
            <option>Student Loan</option>
            <option>Medical / Dental Bills</option>
            <option>Appliance / Furniture</option>
            <option>Other Payments</option>
          </select>
        </div>
        <div class="col">
          <label>Amount</label>
          <input placeholder="$" class="control js-debt-amount">
        </div>
      </li>
    </ul>
    <div class="form-row"><a href="#" class="calc-btn js-add-debt"> <i class="fa fa-plus"></i>Add Monthly Debt Payments</a></div>
    <div class="form-row last"><a href="#" class="calc-btn orange lg js-calculate">Calculate<i class="fa fa-angle-right"></i></a></div>
  </div>
  <div class="calc-results">
    <div class="calc-result">
      <h3 class="calc-result-title">Results <a href="#" class="toggler js-toggler"><i class="fa fa-angle-down"></i></a></h3>
      <div class="calc-result-content js-additional-info"></div>
    </div>
  </div>
</div>