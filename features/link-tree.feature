Feature: Interactive Link Tree
  As a user
  I want to view an interactive link tree
  So that I can easily navigate to important pages

  Scenario: Viewing the link tree
    Given I am on the link tree page
    When the page loads
    Then I should see a list of links
    And each link should display its title and destination

  Scenario: Adding a new link
    Given I am authenticated
    When I click "Add Link"
    And I fill in the title and destination
    And I save the link
    Then the new link should appear in the list

  Scenario: Editing a link
    Given I am authenticated
    And there is an existing link
    When I click "Edit" on the link
    And I change the destination
    And I save the changes
    Then the link should be updated in the list

  Scenario: Deleting a link
    Given I am authenticated
    And there is an existing link
    When I click "Delete" on the link
    And I confirm the deletion
    Then the link should be removed from the list
