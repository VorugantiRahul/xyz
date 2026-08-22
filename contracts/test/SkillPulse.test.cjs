const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillPulse Smart Contract Tests", function () {
  let skillPulse;
  let owner;
  let candidate;
  let otherUser;

  const SAMPLE_SKILL = "Solidity";
  const SAMPLE_CHALLENGE_HASH = ethers.keccak256(ethers.toUtf8Bytes("Solidity Vault Challenge"));
  const SAMPLE_EVIDENCE_HASH = ethers.keccak256(ethers.toUtf8Bytes("contract Vault { ... }"));
  const SAMPLE_SCORE = 91;

  beforeEach(async function () {
    [owner, candidate, otherUser] = await ethers.getSigners();
    const SkillPulseFactory = await ethers.getContractFactory("SkillPulse");
    skillPulse = await SkillPulseFactory.deploy();
    await skillPulse.waitForDeployment();
  });

  // 1. Create Challenge
  it("1. should create a challenge correctly and emit ChallengeCreated event", async function () {
    await expect(skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH))
      .to.emit(skillPulse, "ChallengeCreated")
      .withArgs(1, candidate.address, SAMPLE_SKILL);

    const challenge = await skillPulse.getChallenge(1);
    expect(challenge.id).to.equal(1);
    expect(challenge.candidate).to.equal(candidate.address);
    expect(challenge.skill).to.equal(SAMPLE_SKILL);
    expect(challenge.challengeHash).to.equal(SAMPLE_CHALLENGE_HASH);
    expect(challenge.evidenceHash).to.equal(ethers.ZeroHash);
    expect(challenge.score).to.equal(0);
    expect(challenge.evidenceSubmitted).to.be.false;
    expect(challenge.verified).to.be.false;
    expect(challenge.lastVerified).to.equal(0);
  });

  // 2. Challenge ID generation
  it("2. should generate incremental unique challenge IDs", async function () {
    await skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH);
    await skillPulse.connect(candidate).createChallenge("Python", SAMPLE_CHALLENGE_HASH);
    await skillPulse.connect(otherUser).createChallenge("React", SAMPLE_CHALLENGE_HASH);

    const ch1 = await skillPulse.getChallenge(1);
    const ch2 = await skillPulse.getChallenge(2);
    const ch3 = await skillPulse.getChallenge(3);

    expect(ch1.id).to.equal(1);
    expect(ch2.id).to.equal(2);
    expect(ch3.id).to.equal(3);
    expect(ch1.skill).to.equal("Solidity");
    expect(ch2.skill).to.equal("Python");
    expect(ch3.skill).to.equal("React");
    expect(ch3.candidate).to.equal(otherUser.address);
  });

  // 3. Submit Evidence
  it("3. should allow candidate to submit evidence and emit EvidenceSubmitted event", async function () {
    await skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH);

    await expect(skillPulse.connect(candidate).submitEvidence(1, SAMPLE_EVIDENCE_HASH, SAMPLE_SCORE))
      .to.emit(skillPulse, "EvidenceSubmitted")
      .withArgs(1, SAMPLE_EVIDENCE_HASH, SAMPLE_SCORE);

    const challenge = await skillPulse.getChallenge(1);
    expect(challenge.evidenceSubmitted).to.be.true;
    expect(challenge.evidenceHash).to.equal(SAMPLE_EVIDENCE_HASH);
    expect(challenge.score).to.equal(SAMPLE_SCORE);
    expect(challenge.verified).to.be.false;
  });

  // 4. Invalid score
  it("4. should revert if score exceeds 100", async function () {
    await skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH);

    await expect(
      skillPulse.connect(candidate).submitEvidence(1, SAMPLE_EVIDENCE_HASH, 101)
    ).to.be.revertedWithCustomError(skillPulse, "InvalidScore");
  });

  // 5. Non-candidate submitting evidence
  it("5. should revert if a non-candidate attempts to submit evidence", async function () {
    await skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH);

    await expect(
      skillPulse.connect(otherUser).submitEvidence(1, SAMPLE_EVIDENCE_HASH, SAMPLE_SCORE)
    ).to.be.revertedWithCustomError(skillPulse, "Unauthorized");
  });

  // 6. Duplicate evidence
  it("6. should revert if evidence is submitted more than once for the same challenge", async function () {
    await skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH);
    await skillPulse.connect(candidate).submitEvidence(1, SAMPLE_EVIDENCE_HASH, SAMPLE_SCORE);

    await expect(
      skillPulse.connect(candidate).submitEvidence(1, SAMPLE_EVIDENCE_HASH, SAMPLE_SCORE)
    ).to.be.revertedWithCustomError(skillPulse, "EvidenceAlreadySubmitted");
  });

  // 7. Verification before evidence
  it("7. should revert if verifySkill is called before evidence submission", async function () {
    await skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH);

    await expect(
      skillPulse.connect(candidate).verifySkill(1)
    ).to.be.revertedWithCustomError(skillPulse, "EvidenceNotSubmitted");
  });

  // 8. Successful verification
  it("8. should successfully verify skill, update lastVerified, and emit SkillVerified event", async function () {
    await skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH);
    await skillPulse.connect(candidate).submitEvidence(1, SAMPLE_EVIDENCE_HASH, SAMPLE_SCORE);

    const tx = await skillPulse.connect(candidate).verifySkill(1);
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    await expect(tx)
      .to.emit(skillPulse, "SkillVerified")
      .withArgs(1, candidate.address, SAMPLE_SKILL, SAMPLE_SCORE, block.timestamp);

    const challenge = await skillPulse.getChallenge(1);
    expect(challenge.verified).to.be.true;
    expect(challenge.lastVerified).to.equal(block.timestamp);
  });

  // 9. getSkillProof
  it("9. should return the correct latest SkillProof after verification", async function () {
    // Before verification, proof should be unverified with 0 score
    const initialProof = await skillPulse.getSkillProof(candidate.address, SAMPLE_SKILL);
    expect(initialProof.verified).to.be.false;
    expect(initialProof.score).to.equal(0);

    // Create, submit evidence, and verify
    await skillPulse.connect(candidate).createChallenge(SAMPLE_SKILL, SAMPLE_CHALLENGE_HASH);
    await skillPulse.connect(candidate).submitEvidence(1, SAMPLE_EVIDENCE_HASH, 91);
    const tx = await skillPulse.connect(candidate).verifySkill(1);
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    const updatedProof = await skillPulse.getSkillProof(candidate.address, SAMPLE_SKILL);
    expect(updatedProof.candidate).to.equal(candidate.address);
    expect(updatedProof.skill).to.equal(SAMPLE_SKILL);
    expect(updatedProof.score).to.equal(91);
    expect(updatedProof.verified).to.be.true;
    expect(updatedProof.lastVerified).to.equal(block.timestamp);
  });
});