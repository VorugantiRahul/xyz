// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SkillPulse
 * @notice AI-Powered Continuous Skill Verification Platform
 * @dev Deployed on Monad Testnet (Chain ID: 10143)
 * Tagline: "Skills change. Proof should stay alive."
 */
contract SkillPulse {
    struct Challenge {
        uint256 id;
        address candidate;
        string skill;
        bytes32 challengeHash;
        bytes32 evidenceHash;
        uint256 score;
        bool evidenceSubmitted;
        bool verified;
        uint256 lastVerified;
    }

    struct SkillProof {
        address candidate;
        string skill;
        uint256 score;
        bool verified;
        uint256 lastVerified;
    }

    // Storage
    uint256 private _challengeIdCounter;
    mapping(uint256 => Challenge) public challenges;
    mapping(address => mapping(string => SkillProof)) public skillProofs;

    // Events
    event ChallengeCreated(
        uint256 indexed challengeId,
        address indexed candidate,
        string skill
    );

    event EvidenceSubmitted(
        uint256 indexed challengeId,
        bytes32 evidenceHash,
        uint256 score
    );

    event SkillVerified(
        uint256 indexed challengeId,
        address indexed candidate,
        string skill,
        uint256 score,
        uint256 timestamp
    );

    // Custom errors for clarity and gas efficiency
    error ChallengeNotFound();
    error Unauthorized();
    error EvidenceAlreadySubmitted();
    error EvidenceNotSubmitted();
    error InvalidScore();

    /**
     * @notice Creates a new challenge for the calling candidate
     * @param skill The name of the skill (e.g. "Solidity")
     * @param challengeHash Keccak256 hash of the generated challenge description and rubric
     * @return challengeId Unique identifier for the challenge
     */
    function createChallenge(
        string calldata skill,
        bytes32 challengeHash
    ) external returns (uint256 challengeId) {
        _challengeIdCounter++;
        challengeId = _challengeIdCounter;

        challenges[challengeId] = Challenge({
            id: challengeId,
            candidate: msg.sender,
            skill: skill,
            challengeHash: challengeHash,
            evidenceHash: bytes32(0),
            score: 0,
            evidenceSubmitted: false,
            verified: false,
            lastVerified: 0
        });

        emit ChallengeCreated(challengeId, msg.sender, skill);
    }

    /**
     * @notice Submits evidence and evaluated score for an existing challenge
     * @param challengeId ID of the challenge
     * @param evidenceHash Keccak256 hash of the candidate submission code/evidence
     * @param score AI-evaluated score (between 0 and 100)
     */
    function submitEvidence(
        uint256 challengeId,
        bytes32 evidenceHash,
        uint256 score
    ) external {
        Challenge storage ch = challenges[challengeId];

        if (ch.id == 0) revert ChallengeNotFound();
        if (ch.candidate != msg.sender) revert Unauthorized();
        if (ch.evidenceSubmitted) revert EvidenceAlreadySubmitted();
        if (score > 100) revert InvalidScore();

        ch.evidenceHash = evidenceHash;
        ch.score = score;
        ch.evidenceSubmitted = true;

        emit EvidenceSubmitted(challengeId, evidenceHash, score);
    }

    /**
     * @notice Verifies the skill on-chain after evidence has been submitted
     * @param challengeId ID of the challenge to verify
     */
    function verifySkill(uint256 challengeId) external {
        Challenge storage ch = challenges[challengeId];

        if (ch.id == 0) revert ChallengeNotFound();
        if (!ch.evidenceSubmitted) revert EvidenceNotSubmitted();

        ch.verified = true;
        ch.lastVerified = block.timestamp;

        // Update latest living skill proof for candidate + skill
        skillProofs[ch.candidate][ch.skill] = SkillProof({
            candidate: ch.candidate,
            skill: ch.skill,
            score: ch.score,
            verified: true,
            lastVerified: block.timestamp
        });

        emit SkillVerified(
            challengeId,
            ch.candidate,
            ch.skill,
            ch.score,
            block.timestamp
        );
    }

    /**
     * @notice Retrieves full challenge details by ID
     * @param challengeId ID of the challenge
     */
    function getChallenge(uint256 challengeId) external view returns (Challenge memory) {
        Challenge memory ch = challenges[challengeId];
        if (ch.id == 0) revert ChallengeNotFound();
        return ch;
    }

    /**
     * @notice Retrieves the latest skill proof for a candidate and skill
     * @param candidate Address of the candidate
     * @param skill Name of the skill (e.g. "Solidity")
     */
    function getSkillProof(
        address candidate,
        string calldata skill
    ) external view returns (SkillProof memory) {
        return skillProofs[candidate][skill];
    }
}