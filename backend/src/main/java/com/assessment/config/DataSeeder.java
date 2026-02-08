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
                        admin.setUsername("heramb");
                        admin.setPassword(passwordEncoder.encode("123456"));
                        admin.setRole("ADMIN");
                        userRepository.save(admin);
                        System.out.println("✓ Admin user created (username: heramb, password: 123456)");
                }
        }

        private void seedQuestions() {
                // Clean up existing questions to ensure only the requested 3 exist
                questionRepository.deleteAll();
                System.out.println("✓ Cleared all existing questions.");

                // Question 1 - Magic Number (Base 7)
                Question q1 = new Question();
                q1.setTitle("The Ath Magic Number");
                q1.setDescription(
                                "<h3>Problem Description</h3>" +
                                                "<p>Given an integer <strong>A</strong>, find and return the <strong>A<sup>th</sup></strong> magic number.</p>"
                                                +
                                                "<p>A magic number is defined as a number that can be expressed as a <strong>power of 7</strong> or a <strong>sum of unique powers of 7</strong>.</p>"
                                                +
                                                "<p>First few magic numbers are:</p>" +
                                                "<ul>" +
                                                "<li>1st: 7<sup>1</sup> = 7</li>" +
                                                "<li>2nd: 7<sup>2</sup> = 49</li>" +
                                                "<li>3rd: 7<sup>2</sup> + 7<sup>1</sup> = 56</li>" +
                                                "<li>4th: 7<sup>3</sup> = 343</li>" +
                                                "</ul>" +
                                                "<hr />" +
                                                "<h3>Problem Constraints</h3>" +
                                                "<ul><li>1 &le; A &le; 5000</li></ul>" +
                                                "<hr />" +
                                                "<h3>Input Format</h3>" +
                                                "<p>The only argument given is integer A.</p>" +
                                                "<hr />" +
                                                "<h3>Output Format</h3>" +
                                                "<p>Return the A<sup>th</sup> magic number.</p>" +
                                                "<hr />" +
                                                "<h3>Example Input</h3>" +
                                                "<p>Example 1:</p><pre>A = 3</pre>" +
                                                "<p>Example 2:</p><pre>A = 10</pre>" +
                                                "<hr />" +
                                                "<h3>Example Output</h3>" +
                                                "<p>Example 1:</p><pre>56</pre>" +
                                                "<p>Example 2:</p><pre>2450</pre>" +
                                                "<hr />" +
                                                "<h3>Example Explanation</h3>" +
                                                "<p><strong>Explanation 1:</strong><br>Magic Numbers in increasing order are [7, 49, 56, 343, 350, ...]. The 3rd element in this sequence is 56.</p>"
                                                +
                                                "<p><strong>Explanation 2:</strong><br>In the sequence shown in explanation 1, the 10th element will be 2450.</p>");
                q1.setSolution(
                                "class Solution {\n" +
                                                "    public int solve(int A) {\n" +
                                                "        int ans = 0;\n" +
                                                "        int power = 7;\n" +
                                                "        while (A > 0) {\n" +
                                                "            if ((A & 1) == 1) {\n" +
                                                "                ans += power;\n" +
                                                "            }\n" +
                                                "            power *= 7;\n" +
                                                "            A >>= 1;\n" +
                                                "        }\n" +
                                                "        return ans;\n" +
                                                "    }\n" +
                                                "}");
                q1.setExplanation("Map bits of A to powers of 7.");
                q1.setTestCases("[\n" +
                                "  {\"input\": \"3\", \"expected\": \"56\"},\n" +
                                "  {\"input\": \"10\", \"expected\": \"2450\"}\n" +
                                "]");
                q1.setStarterCode(
                                "public class Solution {\n" +
                                                "    public int solve(int A) {\n" +
                                                "        // Write your code here\n" +
                                                "        return 0;\n" +
                                                "    }\n" +
                                                "}");
                q1.setReleaseTime(LocalDateTime.now().minusDays(1));
                upsertQuestion(q1);

                // Question 2 - The Avoidance Game
                Question q2 = new Question();
                q2.setTitle("The Avoidance Game");
                q2.setDescription(
                                "<h3>Problem Description</h3>" +
                                                "<p>In the \"100 Game\", two players take turns adding to a running total... In this specific variation (Misere Play), the win condition is reversed:</p>"
                                                +
                                                "<p>Two players take turns drawing from a common pool of numbers from 1 to <code>maxChoosableInteger</code> <strong>without replacement</strong>.</p>"
                                                +
                                                "<p>The player who causes the running total to reach or exceed <code>desiredTotal</code> <strong>LOSES</strong>.</p>"
                                                +
                                                "<p>Given two integers <code>maxChoosableInteger</code> and <code>desiredTotal</code>, return <code>true</code> if the first player to move can force a win, otherwise, return <code>false</code>. Assume both players play optimally.</p>"
                                                +
                                                "<hr />" +
                                                "<h3>Problem Constraints</h3>" +
                                                "<ul><li>1 &le; maxChoosableInteger &le; 20</li><li>0 &le; desiredTotal &le; 300</li></ul>"
                                                +
                                                "<hr />" +
                                                "<h3>Input Format</h3>" +
                                                "<p>First argument is integer maxChoosableInteger.<br>Second argument is integer desiredTotal.</p>"
                                                +
                                                "<hr />" +
                                                "<h3>Output Format</h3>" +
                                                "<p>Return a boolean: true if the first player wins, false otherwise.</p>"
                                                +
                                                "<hr />" +
                                                "<h3>Example Input</h3>" +
                                                "<p>Example 1:</p><pre>maxChoosableInteger = 3, desiredTotal = 4</pre>"
                                                +
                                                "<p>Example 2:</p><pre>maxChoosableInteger = 10, desiredTotal = 1</pre>"
                                                +
                                                "<hr />" +
                                                "<h3>Example Output</h3>" +
                                                "<p>Example 1:</p><pre>true</pre>" +
                                                "<p>Example 2:</p><pre>false</pre>" +
                                                "<hr />" +
                                                "<h3>Example Explanation</h3>" +
                                                "<p><strong>Explanation 1:</strong><br>Player 1 can choose 3. Total becomes 3. Pool {1, 2}.<br>If Player 2 choose 1 -> Total 4 (LOSE).<br>If Player 2 choose 2 -> Total 5 (LOSE).<br>Player 1 wins.</p>"
                                                +
                                                "<p><strong>Explanation 2:</strong><br>Desired total is 1. Any move (min 1) causes total to reach 1. Player 1 LOSES immediately.</p>");
                q2.setSolution(
                                "class Solution {\n" +
                                                "    private byte[] memo;\n" +
                                                "    private int m, t;\n" +
                                                "    public boolean canIWin(int maxChoosableInteger, int desiredTotal) {\n"
                                                +
                                                "        m = maxChoosableInteger;\n" +
                                                "        t = desiredTotal;\n" +
                                                "        if (t <= 0) return false; // Should not happen based on constraints but if allowed, 0 means already lost?\n"
                                                +
                                                "        // Wait, if desiredTotal is 1, and I pick 1, new total is 1. 1 >= 1 -> I LOSE.\n"
                                                +
                                                "        // If desiredTotal <= 0, game over already?\n" +
                                                "        // Example 2: Desired=1. P1 picks 1. Total=1. 1 >= Desired -> P1 Loses -> Return false.\n"
                                                +
                                                "        \n" +
                                                "        // Sum of all numbers\n" +
                                                "        int sum = m * (m + 1) / 2;\n" +
                                                "        // If total sum < desiredTotal, nobody ever loses? Convention usually means 'cannot force win' or draw. \n"
                                                +
                                                "        // But problem implies someone will lose unless total is unreachable.\n"
                                                +
                                                "        if (sum < t) return true; // If we can't likely reach it, does P1 win? \n"
                                                +
                                                "        // Let's assume standard game logic from description.\n" +
                                                "        \n" +
                                                "        memo = new byte[1 << m];\n" +
                                                "        return canWin(0, 0);\n" +
                                                "    }\n" +
                                                "    // Returns true if the CURRENT player can force a win from this state\n"
                                                +
                                                "    private boolean canWin(int mask, int currentTotal) {\n" +
                                                "        if (memo[mask] != 0) return memo[mask] == 1;\n" +
                                                "        \n" +
                                                "        // Try all available moves\n" +
                                                "        for (int i = 0; i < m; i++) {\n" +
                                                "             if ((mask & (1 << i)) == 0) {\n" +
                                                "                 int chosen = i + 1;\n" +
                                                "                 // If choosing this causes ME to lose immediately\n" +
                                                "                 if (currentTotal + chosen >= t) {\n" +
                                                "                     continue; // This is a losing move, don't pick it unless forced\n"
                                                +
                                                "                 }\n" +
                                                "                 \n" +
                                                "                 // If I pick 'chosen', can the NEXT player force a win?\n"
                                                +
                                                "                 // If next player CANNOT force a win (!canWin), then I WIN.\n"
                                                +
                                                "                 if (!canWin(mask | (1 << i), currentTotal + chosen)) {\n"
                                                +
                                                "                      memo[mask] = 1;\n" +
                                                "                      return true;\n" +
                                                "                 }\n" +
                                                "             }\n" +
                                                "        }\n" +
                                                "        \n" +
                                                "        // If all valid moves lead to opponent winning, or if NO valid moves exist (all cross total),\n"
                                                +
                                                "        // then I Lose.\n" +
                                                "        memo[mask] = 2;\n" +
                                                "        return false;\n" +
                                                "    }\n" +
                                                "}");
                q2.setTestCases("[\n" +
                                "  {\"input\": \"max=3, total=4\", \"expected\": \"true\"},\n" +
                                "  {\"input\": \"max=10, total=1\", \"expected\": \"false\"}\n" +
                                "]");
                q2.setStarterCode(
                                "public class Solution {\n" +
                                                "    public boolean canIWin(int maxChoosableInteger, int desiredTotal) {\n"
                                                +
                                                "        // Write your code here\n" +
                                                "        return false;\n" +
                                                "    }\n" +
                                                "}");
                q2.setExplanation("Recursive solution with bitmask memoization. Misere play.");
                q2.setReleaseTime(LocalDateTime.now().minusDays(1));
                upsertQuestion(q2);

                // Question 3 - Sum of Pairwise Bitwise AND
                Question q3 = new Question();
                q3.setTitle("Sum of Pairwise Bitwise AND");
                q3.setDescription(
                                "<h3>Problem Description</h3>" +
                                                "<p>Given an array <strong>A</strong> of N integers. Find the sum of the bitwise AND of all pairs of numbers in the array. Since the answer can be large, return the remainder after dividing the answer by 10<sup>9</sup> + 7.</p>"
                                                +
                                                "<hr />" +
                                                "<h3>Problem Constraints</h3>" +
                                                "<ul><li>1 &le; N &le; 10<sup>5</sup></li><li>1 &le; A[i] &lt; 10<sup>9</sup></li></ul>"
                                                +
                                                "<hr />" +
                                                "<h3>Input Format</h3>" +
                                                "<p>The only argument given is the integer array A.</p>" +
                                                "<hr />" +
                                                "<h3>Output Format</h3>" +
                                                "<p>Return an integer denoting the sum of bitwise AND of all pairs of numbers in the array modulo 10<sup>9</sup> + 7.</p>"
                                                +
                                                "<hr />" +
                                                "<h3>Example Input</h3>" +
                                                "<p>Example 1:</p><pre>A = [1, 2, 3]</pre>" +
                                                "<p>Example 2:</p><pre>A = [3, 4, 2]</pre>" +
                                                "<hr />" +
                                                "<h3>Example Output</h3>" +
                                                "<p>Example 1:</p><pre>3</pre>" +
                                                "<p>Example 2:</p><pre>2</pre>" +
                                                "<hr />" +
                                                "<h3>Example Explanation</h3>" +
                                                "<p><strong>Explanation 1:</strong><br>{1, 2} -&gt; 0<br>{1, 3} -&gt; 1<br>{2, 3} -&gt; 2<br>Sum = 3.</p>"
                                                +
                                                "<p><strong>Explanation 2:</strong><br>{3, 4} -&gt; 0<br>{3, 2} -&gt; 2<br>{4, 2} -&gt; 0<br>Sum = 2.</p>");
                q3.setSolution(
                                "class Solution {\n" +
                                                "    public int solve(int[] A) {\n" +
                                                "        long ans = 0;\n" +
                                                "        long MOD = 1000000007;\n" +
                                                "        for (int i = 0; i < 31; i++) {\n" +
                                                "            long count = 0;\n" +
                                                "            for (int num : A) {\n" +
                                                "                if ((num & (1 << i)) != 0) count++;\n" +
                                                "            }\n" +
                                                "            if (count < 2) continue;\n" +
                                                "            long pairs = (count * (count - 1)) / 2;\n" +
                                                "            long contribution = (pairs % MOD * (1 << i) % MOD) % MOD;\n"
                                                +
                                                "            ans = (ans + contribution) % MOD;\n" +
                                                "        }\n" +
                                                "        return (int) ans;\n" +
                                                "    }\n" +
                                                "}");
                q3.setTestCases("[\n" +
                                "  {\"input\": \"[1, 2, 3]\", \"expected\": \"3\"},\n" +
                                "  {\"input\": \"[3, 4, 2]\", \"expected\": \"2\"}\n" +
                                "]");
                q3.setStarterCode(
                                "public class Solution {\n" +
                                                "    public int solve(int[] A) {\n" +
                                                "        // Write your code here\n" +
                                                "        return 0;\n" +
                                                "    }\n" +
                                                "}");
                q3.setExplanation("Calculate contribution of each bit position.");
                q3.setReleaseTime(LocalDateTime.now().minusDays(1));
                upsertQuestion(q3);
        }

        private void upsertQuestion(Question question) {
                java.util.Optional<Question> existing = questionRepository.findByTitle(question.getTitle());
                if (existing.isPresent()) {
                        Question target = existing.get();
                        target.setDescription(question.getDescription());
                        target.setSolution(question.getSolution());
                        target.setTestCases(question.getTestCases());
                        target.setExplanation(question.getExplanation());
                        target.setReleaseTime(question.getReleaseTime());
                        target.setStarterCode(question.getStarterCode()); // Ensure starter code is updated
                        questionRepository.save(target);
                        System.out.println("✓ Updated question: " + question.getTitle());
                } else {
                        questionRepository.save(question);
                        System.out.println("✓ Created question: " + question.getTitle());
                }
        }
}
