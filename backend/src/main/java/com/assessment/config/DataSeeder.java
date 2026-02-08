package com.assessment.config;

import com.assessment.model.Question;
import com.assessment.model.User;
import com.assessment.repository.QuestionRepository;
import com.assessment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private QuestionRepository questionRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                seedAdminUser();
                seedQuestions();
        }

        private void seedAdminUser() {
                if (userRepository.count() == 0) {
                        User admin = new User();
                        admin.setUsername("admin");
                        admin.setPassword(passwordEncoder.encode("password"));
                        admin.setRole("ADMIN");
                        userRepository.save(admin);
                        System.out.println("✓ Admin user created (username: admin, password: password)");
                }
        }

        private void seedQuestions() {
                if (questionRepository.count() == 0) {
                        List<Question> questions = new ArrayList<>();

                        // Question 1 - Magic Number Problem
                        Question q1 = new Question();
                        q1.setTitle("The Ath Magic Number");
                        q1.setDescription(
                                        "<h3>Problem Description</h3>\n\n" +
                                                        "<p>Given an integer <strong>A</strong>, find and return the <strong>A<sup>th</sup></strong> magic number.</p>\n\n"
                                                        +
                                                        "<p>A magic number is defined as a number that can be expressed as a <em>power of 7</em> or a <em>sum of unique powers of 7</em>.</p>\n\n"
                                                        +
                                                        "<h4>First Few Magic Numbers:</h4>\n" +
                                                        "<ul>\n" +
                                                        "  <li>1<sup>st</sup>: 7<sup>1</sup> = <strong>7</strong></li>\n"
                                                        +
                                                        "  <li>2<sup>nd</sup>: 7<sup>2</sup> = <strong>49</strong></li>\n"
                                                        +
                                                        "  <li>3<sup>rd</sup>: 7<sup>2</sup> + 7<sup>1</sup> = 49 + 7 = <strong>56</strong></li>\n"
                                                        +
                                                        "  <li>4<sup>th</sup>: 7<sup>3</sup> = <strong>343</strong></li>\n"
                                                        +
                                                        "  <li>5<sup>th</sup>: 7<sup>3</sup> + 7<sup>1</sup> = 343 + 7 = <strong>350</strong></li>\n"
                                                        +
                                                        "</ul>\n\n" +
                                                        "<h4>Logic: Binary Representation</h4>\n" +
                                                        "<p>The magic numbers follow a pattern based on the binary representation of A. Map the bits of A to powers of 7:</p>\n"
                                                        +
                                                        "<ol>\n" +
                                                        "  <li>Write A in binary.</li>\n" +
                                                        "  <li>Iterate through the bits starting from the least significant bit (rightmost).</li>\n"
                                                        +
                                                        "  <li>If the i<sup>th</sup> bit is 1, add 7<sup>(i+1)</sup> to the answer.</li>\n"
                                                        +
                                                        "  <li>If the i<sup>th</sup> bit is 0, do nothing.</li>\n" +
                                                        "</ol>\n\n" +
                                                        "<h4>Example 1: A = 3</h4>\n" +
                                                        "<div class='example-box'>\n" +
                                                        "  <p>Binary of 3 is <code>011</code></p>\n" +
                                                        "  <ul>\n" +
                                                        "    <li>Bit 0 (value 1) is set → Add 7<sup>1</sup> = 7</li>\n"
                                                        +
                                                        "    <li>Bit 1 (value 1) is set → Add 7<sup>2</sup> = 49</li>\n"
                                                        +
                                                        "  </ul>\n" +
                                                        "  <p><strong>Total: 7 + 49 = 56</strong></p>\n" +
                                                        "</div>\n\n" +
                                                        "<h4>Example 2: A = 10</h4>\n" +
                                                        "<div class='example-box'>\n" +
                                                        "  <p>Binary of 10 is <code>1010</code></p>\n" +
                                                        "  <ul>\n" +
                                                        "    <li>Bit 0 is 0 → Ignore 7<sup>1</sup></li>\n" +
                                                        "    <li>Bit 1 is 1 → Add 7<sup>2</sup> = 49</li>\n" +
                                                        "    <li>Bit 2 is 0 → Ignore 7<sup>3</sup></li>\n" +
                                                        "    <li>Bit 3 is 1 → Add 7<sup>4</sup> = 2401</li>\n" +
                                                        "  </ul>\n" +
                                                        "  <p><strong>Total: 49 + 2401 = 2450</strong></p>\n" +
                                                        "</div>\n\n" +
                                                        "<h4>Constraints</h4>\n" +
                                                        "<ul>\n" +
                                                        "  <li>Time Complexity: O(log A)</li>\n" +
                                                        "  <li>Space Complexity: O(1)</li>\n" +
                                                        "  <li>Since A can be up to 5000, use <code>long</code> to prevent overflow (up to 7<sup>13</sup>)</li>\n"
                                                        +
                                                        "</ul>");
                        // Clean solution - only the function
                        q1.setSolution(
                                        "public long solve(int A) {\n" +
                                                        "    long ans = 0;\n" +
                                                        "    long power = 7;\n\n" +
                                                        "    for (int i = 0; A > 0; i++) {\n" +
                                                        "        if ((A & 1) == 1) {\n" +
                                                        "            ans += power;\n" +
                                                        "        }\n" +
                                                        "        power *= 7;\n" +
                                                        "        A >>= 1;\n" +
                                                        "    }\n\n" +
                                                        "    return ans;\n" +
                                                        "}");
                        // Test cases
                        q1.setTestCases(
                                        "[\n" +
                                                        "  {\"input\": \"1\", \"expected\": \"7\"},\n" +
                                                        "  {\"input\": \"2\", \"expected\": \"49\"},\n" +
                                                        "  {\"input\": \"3\", \"expected\": \"56\"},\n" +
                                                        "  {\"input\": \"4\", \"expected\": \"343\"},\n" +
                                                        "  {\"input\": \"5\", \"expected\": \"350\"},\n" +
                                                        "  {\"input\": \"10\", \"expected\": \"2450\"},\n" +
                                                        "  {\"input\": \"7\", \"expected\": \"399\"},\n" +
                                                        "  {\"input\": \"15\", \"expected\": \"2800\"}\n" +
                                                        "]");
                        q1.setExplanation(
                                        "<p>We use the binary representation of A to determine which powers of 7 to add.</p>\n"
                                                        +
                                                        "<p><strong>Key insight:</strong> Each magic number can be uniquely represented as a sum of distinct powers of 7, which maps to binary representation.</p>");
                        q1.setReleaseTime(LocalDateTime.parse("2026-12-01T10:00:00"));
                        questions.add(q1);

                        // Question 2 - Misere Game Problem
                        Question q2 = new Question();
                        q2.setTitle("The Avoidance Game (Misere 100 Game)");
                        q2.setDescription(
                                        "<h3>Problem Description</h3>\n\n" +
                                                        "<p>Two players play a turn-based game with a pool of integers from <strong>1</strong> to <strong>maxChoosableInteger</strong>.</p>\n\n"
                                                        +
                                                        "<p>They take turns adding integers from this pool to a running <code>currentTotal</code>, which starts at 0.</p>\n\n"
                                                        +
                                                        "<h4>Rules:</h4>\n" +
                                                        "<ol>\n" +
                                                        "  <li><strong>No Reuse:</strong> Once an integer is chosen, it cannot be used again.</li>\n"
                                                        +
                                                        "  <li><strong>Losing Condition:</strong> If a player's move makes <code>currentTotal ≥ desiredTotal</code>, that player <em>loses</em>.</li>\n"
                                                        +
                                                        "  <li><strong>Winning Condition:</strong> Force your opponent to trigger the losing condition.</li>\n"
                                                        +
                                                        "</ol>\n\n" +
                                                        "<p>Return <code>true</code> if the first player can force a win with optimal play, otherwise <code>false</code>.</p>\n\n"
                                                        +
                                                        "<h4>Constraints:</h4>\n" +
                                                        "<ul>\n" +
                                                        "  <li>1 ≤ maxChoosableInteger ≤ 20</li>\n" +
                                                        "  <li>0 ≤ desiredTotal ≤ 300</li>\n" +
                                                        "</ul>\n\n" +
                                                        "<h4>Example 1:</h4>\n" +
                                                        "<div class='example-box'>\n" +
                                                        "  <p><strong>Input:</strong> maxChoosableInteger = 3, desiredTotal = 4</p>\n"
                                                        +
                                                        "  <p><strong>Output:</strong> <code>true</code></p>\n" +
                                                        "  <p><strong>Explanation:</strong></p>\n" +
                                                        "  <ul>\n" +
                                                        "    <li>Player 1 picks 3 → Total = 3</li>\n" +
                                                        "    <li>Player 2 must pick from {1, 2}</li>\n" +
                                                        "    <li>If P2 picks 1 → Total = 4 → P2 <em>loses</em></li>\n" +
                                                        "    <li>If P2 picks 2 → Total = 5 → P2 <em>loses</em></li>\n" +
                                                        "  </ul>\n" +
                                                        "  <p>Player 1 <strong>wins</strong>!</p>\n" +
                                                        "</div>\n\n" +
                                                        "<h4>Example 2:</h4>\n" +
                                                        "<div class='example-box'>\n" +
                                                        "  <p><strong>Input:</strong> maxChoosableInteger = 10, desiredTotal = 1</p>\n"
                                                        +
                                                        "  <p><strong>Output:</strong> <code>false</code></p>\n" +
                                                        "  <p><strong>Explanation:</strong> Any choice by Player 1 makes total ≥ 1. Player 1 loses immediately.</p>\n"
                                                        +
                                                        "</div>");
                        // Clean solution - only the function
                        q2.setSolution(
                                        "private byte[] memo;\n" +
                                                        "private int maxChoosableInteger;\n" +
                                                        "private int desiredTotal;\n\n" +
                                                        "public boolean canIWin(int maxChoosableInteger, int desiredTotal) {\n"
                                                        +
                                                        "    this.maxChoosableInteger = maxChoosableInteger;\n" +
                                                        "    this.desiredTotal = desiredTotal;\n\n" +
                                                        "    if (desiredTotal <= 0) return false;\n\n" +
                                                        "    int sum = maxChoosableInteger * (maxChoosableInteger + 1) / 2;\n"
                                                        +
                                                        "    if (sum < desiredTotal) return false;\n\n" +
                                                        "    memo = new byte[1 << maxChoosableInteger];\n" +
                                                        "    return canWin(0, 0);\n" +
                                                        "}\n\n" +
                                                        "private boolean canWin(int mask, int currentTotal) {\n" +
                                                        "    if (memo[mask] != 0) return memo[mask] == 1;\n\n" +
                                                        "    for (int i = 0; i < maxChoosableInteger; i++) {\n" +
                                                        "        if ((mask & (1 << i)) == 0) {\n" +
                                                        "            int number = i + 1;\n" +
                                                        "            if (currentTotal + number >= desiredTotal) continue;\n"
                                                        +
                                                        "            if (!canWin(mask | (1 << i), currentTotal + number)) {\n"
                                                        +
                                                        "                memo[mask] = 1;\n" +
                                                        "                return true;\n" +
                                                        "            }\n" +
                                                        "        }\n" +
                                                        "    }\n" +
                                                        "    memo[mask] = 2;\n" +
                                                        "    return false;\n" +
                                                        "}");
                        // Test cases
                        q2.setTestCases(
                                        "[\n" +
                                                        "  {\"input\": \"3, 4\", \"expected\": \"true\"},\n" +
                                                        "  {\"input\": \"10, 1\", \"expected\": \"false\"},\n" +
                                                        "  {\"input\": \"5, 10\", \"expected\": \"true\"},\n" +
                                                        "  {\"input\": \"4, 6\", \"expected\": \"true\"},\n" +
                                                        "  {\"input\": \"2, 3\", \"expected\": \"false\"},\n" +
                                                        "  {\"input\": \"10, 40\", \"expected\": \"false\"},\n" +
                                                        "  {\"input\": \"6, 16\", \"expected\": \"true\"}\n" +
                                                        "]");
                        q2.setExplanation(
                                        "<p>Use <strong>Minimax with Memoization</strong> and bitmask for state representation.</p>\n"
                                                        +
                                                        "<p>Time: O(M × 2<sup>M</sup>), Space: O(2<sup>M</sup>) where M = maxChoosableInteger</p>");
                        q2.setReleaseTime(LocalDateTime.parse("2026-12-15T10:00:00"));
                        questions.add(q2);

                        // Question 3 - Sum of Bitwise AND Problem
                        Question q3 = new Question();
                        q3.setTitle("Sum of Bitwise AND of All Pairs");
                        q3.setDescription(
                                        "<h3>Problem Description</h3>\n\n" +
                                                        "<p>Given an array <strong>A</strong> of N integers, find the sum of the bitwise AND of all pairs.</p>\n\n"
                                                        +
                                                        "<p>Since the answer can be large, return the remainder after dividing by <strong>10<sup>9</sup> + 7</strong>.</p>\n\n"
                                                        +
                                                        "<h4>Constraints:</h4>\n" +
                                                        "<ul>\n" +
                                                        "  <li>1 ≤ N ≤ 10<sup>5</sup></li>\n" +
                                                        "  <li>1 ≤ A[i] < 10<sup>9</sup></li>\n" +
                                                        "</ul>\n\n" +
                                                        "<h4>Example 1:</h4>\n" +
                                                        "<div class='example-box'>\n" +
                                                        "  <p><strong>Input:</strong> A = [1, 2, 3]</p>\n" +
                                                        "  <p><strong>Output:</strong> <code>3</code></p>\n" +
                                                        "  <table class='example-table'>\n" +
                                                        "    <tr><th>Pair</th><th>AND Result</th></tr>\n" +
                                                        "    <tr><td>(1, 2)</td><td>1 & 2 = 0</td></tr>\n" +
                                                        "    <tr><td>(1, 3)</td><td>1 & 3 = 1</td></tr>\n" +
                                                        "    <tr><td>(2, 3)</td><td>2 & 3 = 2</td></tr>\n" +
                                                        "  </table>\n" +
                                                        "  <p><strong>Sum: 0 + 1 + 2 = 3</strong></p>\n" +
                                                        "</div>\n\n" +
                                                        "<h4>Example 2:</h4>\n" +
                                                        "<div class='example-box'>\n" +
                                                        "  <p><strong>Input:</strong> A = [3, 4, 2]</p>\n" +
                                                        "  <p><strong>Output:</strong> <code>2</code></p>\n" +
                                                        "  <table class='example-table'>\n" +
                                                        "    <tr><th>Pair</th><th>AND Result</th></tr>\n" +
                                                        "    <tr><td>(3, 4)</td><td>3 & 4 = 0</td></tr>\n" +
                                                        "    <tr><td>(3, 2)</td><td>3 & 2 = 2</td></tr>\n" +
                                                        "    <tr><td>(4, 2)</td><td>4 & 2 = 0</td></tr>\n" +
                                                        "  </table>\n" +
                                                        "  <p><strong>Sum: 0 + 2 + 0 = 2</strong></p>\n" +
                                                        "</div>\n\n" +
                                                        "<h4>Logic: Contribution Technique</h4>\n" +
                                                        "<p>Instead of O(N<sup>2</sup>) brute force, calculate each bit's contribution:</p>\n"
                                                        +
                                                        "<ol>\n" +
                                                        "  <li>For each bit position i (0 to 30), count numbers with bit i set.</li>\n"
                                                        +
                                                        "  <li>Valid pairs = <sup>count</sup>C<sub>2</sub> = count × (count - 1) / 2</li>\n"
                                                        +
                                                        "  <li>Contribution = validPairs × 2<sup>i</sup></li>\n" +
                                                        "</ol>\n" +
                                                        "<p><strong>Time: O(31 × N) ≈ O(N)</strong></p>");
                        // Clean solution - only the function
                        q3.setSolution(
                                        "public int solve(int[] A) {\n" +
                                                        "    long totalSum = 0;\n" +
                                                        "    long MOD = 1000000007;\n" +
                                                        "    \n" +
                                                        "    for (int i = 0; i < 31; i++) {\n" +
                                                        "        long countSetBits = 0;\n\n" +
                                                        "        for (int j = 0; j < A.length; j++) {\n" +
                                                        "            if ((A[j] & (1 << i)) != 0) {\n" +
                                                        "                countSetBits++;\n" +
                                                        "            }\n" +
                                                        "        }\n\n" +
                                                        "        if (countSetBits < 2) continue;\n\n" +
                                                        "        long validPairs = (countSetBits * (countSetBits - 1)) / 2;\n"
                                                        +
                                                        "        long contribution = (validPairs % MOD * (1 << i) % MOD) % MOD;\n"
                                                        +
                                                        "        totalSum = (totalSum + contribution) % MOD;\n" +
                                                        "    }\n\n" +
                                                        "    return (int) totalSum;\n" +
                                                        "}");
                        // Test cases
                        q3.setTestCases(
                                        "[\n" +
                                                        "  {\"input\": \"[1, 2, 3]\", \"expected\": \"3\"},\n" +
                                                        "  {\"input\": \"[3, 4, 2]\", \"expected\": \"2\"},\n" +
                                                        "  {\"input\": \"[1, 1, 1]\", \"expected\": \"3\"},\n" +
                                                        "  {\"input\": \"[5, 7, 3]\", \"expected\": \"13\"},\n" +
                                                        "  {\"input\": \"[8, 4, 2]\", \"expected\": \"0\"},\n" +
                                                        "  {\"input\": \"[15, 15, 15, 15]\", \"expected\": \"90\"},\n" +
                                                        "  {\"input\": \"[1, 2]\", \"expected\": \"0\"}\n" +
                                                        "]");
                        q3.setExplanation(
                                        "<p>Use <strong>Contribution Technique</strong> - count bits and calculate pairs.</p>\n"
                                                        +
                                                        "<p>The AND of two numbers has bit i set only if <em>both</em> numbers have bit i set.</p>");
                        q3.setReleaseTime(LocalDateTime.parse("2027-01-01T10:00:00"));
                        questions.add(q3);

                        for (int i = 0; i < questions.size(); i++) {
                                questionRepository.save(questions.get(i));
                        }

                        System.out.println("✓ " + questions.size() + " coding assessment questions loaded");
                }
        }
}
