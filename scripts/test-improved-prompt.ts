import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { analyzeRepo } from '../src/lib/llm/client';

async function main() {
    try {
        console.log("Testing improved LLM prompt with a small test repository...\n");

        // Use a simple test case with minimal repo data
        const testRepoData = {
            name: "test-repo",
            owner: "test-user",
            language: "TypeScript",
            description: "A simple TypeScript project for testing",
            tree: [
                { path: "src/index.ts", type: "file" },
                { path: "src/utils.ts", type: "file" },
                { path: "package.json", type: "file" },
                { path: "README.md", type: "file" }
            ]
        };

        console.log("Running analysis with improved prompt...");
        const result = await analyzeRepo(testRepoData);

        console.log("\n✅ SUCCESS: Analysis completed without Zod validation errors!\n");

        // Validate specific fields that were causing issues
        console.log("Validation Checks:");
        console.log("------------------");

        // Check 1: maintainabilityScore should be 1-10
        const score = result.executiveVerdict.maintainabilityScore;
        if (score >= 1 && score <= 10) {
            console.log(`✓ maintainabilityScore: ${score} (valid 1-10 range)`);
        } else {
            console.error(`✗ maintainabilityScore: ${score} (INVALID - should be 1-10)`);
        }

        // Check 2: sideEffectZones should be string
        const sideEffects = result.executionFlow.sideEffectZones;
        if (typeof sideEffects === 'string') {
            console.log(`✓ sideEffectZones: string (${sideEffects.substring(0, 50)}...)`);
        } else {
            console.error(`✗ sideEffectZones: ${typeof sideEffects} (INVALID - should be string)`);
        }

        // Check 3: refactorSafetyRating should be exact enum
        const refactorRating = result.testingProfile.refactorSafetyRating;
        const validRefactorRatings = ['Low', 'Moderate', 'High'];
        if (validRefactorRatings.includes(refactorRating)) {
            console.log(`✓ refactorSafetyRating: "${refactorRating}" (valid enum)`);
        } else {
            console.error(`✗ refactorSafetyRating: "${refactorRating}" (INVALID)`);
        }

        // Check 4: setupComplexity should be exact enum
        const setupComplexity = result.onboarding.setupComplexity;
        const validSetupComplexity = ['Low', 'Moderate', 'High'];
        if (validSetupComplexity.includes(setupComplexity)) {
            console.log(`✓ setupComplexity: "${setupComplexity}" (valid enum)`);
        } else {
            console.error(`✗ setupComplexity: "${setupComplexity}" (INVALID)`);
        }

        // Check 5: documentationClarity should be exact enum
        const docClarity = result.onboarding.documentationClarity;
        const validDocClarity = ['Poor', 'Average', 'Excellent'];
        if (validDocClarity.includes(docClarity)) {
            console.log(`✓ documentationClarity: "${docClarity}" (valid enum)`);
        } else {
            console.error(`✗ documentationClarity: "${docClarity}" (INVALID)`);
        }

        console.log("\n✅ All validation checks passed!");
        console.log("\nSample output:");
        console.log("- Maturity Stage:", result.executiveVerdict.maturityStage);
        console.log("- Maintainability Score:", result.executiveVerdict.maintainabilityScore, "/10");
        console.log("- Refactor Safety:", result.executiveVerdict.refactorSafety);
        console.log("- Production Readiness:", result.executiveVerdict.productionReadiness);

    } catch (error: any) {
        console.error("\n❌ FAILURE: Analysis failed with error:");
        console.error(error.message);

        if (error.name === 'ZodError') {
            console.error("\n📋 Zod Validation Errors:");
            console.error(JSON.stringify(error.errors, null, 2));
        }

        process.exit(1);
    }
}

main();
