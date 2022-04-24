import { Skill, User } from '@/models';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Progress, Text } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const skills: Skill[] = [
  {
    id: '1',
    name: 'Knife',
    damage: 30,
    cooldown: 4000,
    rangeAttack: 400,
    attackImageUrl: '/knife.png',
    transform: 'rotate(240deg)',
  },
  {
    id: '2',
    name: 'Hammer',
    damage: 15,
    cooldown: 2000,
    rangeAttack: 100,
    attackImageUrl: '/hammer.png',
    transform: 'rotate(20deg)',
  },
];

const variants: Variants = {
  attack: ({ pos, transform }) => ({
    opacity: 1,
    left: pos,
    transform,
    transition: {
      duration: 1,
    },
  }),
};

const Home: NextPage = () => {
  const [userA, setUserA] = useState<User>({
    id: '1',
    name: 'A',
    health: 100,
  });
  const [userB, setUserB] = useState<User>({
    id: '2',
    name: 'B',
    health: 100,
  });

  const [showAttackAnimation, setShowAttackAnimation] = useState<boolean>(false);
  const [currentSkill, setCurrentSkill] = useState<Skill>();
  const [currentMove, setCurrentMove] = useState<string>('ArrowRight');
  const [skillCooldown, setSkillCooldown] = useState<number>(0);
  const [moveCooldown, setMoveCooldown] = useState<number>(0);

  const [posBackground, setPosBackground] = useState<number>(0);
  const [posA, setPosA] = useState<number>(300);
  const [posB, setPosB] = useState<number>(800);

  useEffect(() => {
    const skillIntervalId = setInterval(function () {
      setSkillCooldown((prev) => prev - 1000);
    }, 1000);

    if (skillCooldown <= 0) clearInterval(skillIntervalId);
    return () => {
      clearInterval(skillIntervalId);
    };
  }, [skillCooldown]);

  useEffect(() => {
    const moveIntervalId = setInterval(function () {
      setMoveCooldown((prev) => prev - 1000);
    }, 1000);
    if (moveCooldown <= 0) clearInterval(moveIntervalId);
    return () => {
      clearInterval(moveIntervalId);
    };
  }, [moveCooldown]);

  useEffect(() => {
    if (moveCooldown > 0) return;
    const handleKeyPress = ({ key }: any) => {
      if (key === 'ArrowRight') {
        handleClickRightArrow();
      }
      if (key === 'ArrowLeft') {
        handleClickLeftArrow();
      }
    };

    window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [moveCooldown]);

  const handleClickRightArrow = () => {
    setCurrentMove('ArrowRight');
    if (moveCooldown > 0) return;
    setMoveCooldown(2000);
    if (posA >= 500) {
      setPosBackground((prevPos) => prevPos + 100);
      setPosB((prevPos) => prevPos - 100);
      return;
    } else {
      setPosA((prevPos) => prevPos + 100);
    }
  };

  const handleClickLeftArrow = () => {
    setCurrentMove('ArrowLeft');
    if (moveCooldown > 0) return;
    setMoveCooldown(2000);
    if (posA <= 200) {
      setPosBackground((prevPos) => prevPos - 100);
      setPosB((prevPos) => prevPos + 100);
    } else {
      setPosA((prevPos) => prevPos - 100);
    }
  };

  const handleClickSkill = (skill: Skill) => {
    setShowAttackAnimation(true);
    setCurrentSkill(skill);
    setSkillCooldown(skill.cooldown);
  };

  const handleAttackComplete = (skill: Skill) => {
    setUserB((prev) => ({ ...userB, health: prev.health - skill.damage > 0 ? prev.health - skill.damage : 0 }));
    setShowAttackAnimation(false);
  };

  return (
    <Container maxW="container.xl">
      <div>
        <Flex justifyContent="space-between" h={350} marginTop={4}>
          <Box h={400} w={200}>
            <Progress hasStripe value={userA.health} w={200} marginY={2} borderRadius={4} />
            <img src="/A.png" alt="" style={{ width: '100%', height: 'auto' }} />
          </Box>
          <Box h={400} w={200}>
            <Progress hasStripe value={userB.health} w={200} marginY={2} colorScheme="pink" borderRadius={4} />
            <img src="/B.png" alt="" style={{ width: '100%', height: 'auto' }} />
          </Box>
        </Flex>

        <Box textAlign="center">
          <Text>DISTANCE: {(posB - posA) / 100}</Text>
        </Box>
        <Box w={1200} h={400} overflow="hidden" position="relative" margin="0 auto" borderRadius={10}>
          <Box
            sx={{
              position: 'absolute',
              backgroundImage:
                'url(https://www.desktopbackground.org/download/1280x960/2014/07/26/799251_flappy-bird-charizard-edition-on-scratch_1920x1080_h.png)',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: `${-posBackground}px 0px`,
              backgroundSize: 'contain',
              width: '8000px',
              height: '100%',
            }}
          />
          <Box position="absolute" left={posA} bottom="70px" w="100px">
            <Box w="90px" m="0 auto">
              <Progress hasStripe value={userA.health} marginY={2} borderRadius={4} />
            </Box>
            <Box w="100px" transform={currentMove === 'ArrowLeft' ? 'scaleX(-1)' : 'scaleX(1)'}>
              <img src="/A.png" alt="" width="100%" height="auto" />
            </Box>
          </Box>

          <Box position="absolute" left={posB} bottom="70px" w="100px">
            <Box w="90px" m="0 auto">
              <Progress hasStripe value={userB.health} marginY={2} colorScheme="pink" borderRadius={4} />
            </Box>
            <Box w="100px" transform={posB - posA < 0 ? 'scaleX(-1)' : 'none'}>
              <img src="/B.png" alt="" width="100%" height="auto" />
            </Box>
          </Box>

          {currentSkill && showAttackAnimation && (
            <motion.div
              style={{ position: 'absolute' }}
              variants={variants}
              custom={{ pos: posB - 50, transform: currentSkill.transform }}
              initial={{ left: posA + 50, bottom: 100, opacity: 0 }}
              animate={showAttackAnimation && 'attack'}
              onAnimationComplete={() => handleAttackComplete(currentSkill)}
            >
              <img src={currentSkill.attackImageUrl} alt="" width="100px" height="auto" />
            </motion.div>
          )}
        </Box>
        <Box mt={4}>
          <Text>Move cooldown: {moveCooldown}</Text>
          <Text>Skill cooldown: {skillCooldown}</Text>
          <Box>
            <Button onClick={handleClickLeftArrow} mr={4} disabled={moveCooldown > 0}>
              <ArrowBackIcon />
            </Button>

            <Button onClick={handleClickRightArrow} disabled={moveCooldown > 0}>
              <ArrowForwardIcon />
            </Button>
          </Box>
          <Box mt={4}>
            {skills.map((skill) => (
              <Button
                disabled={skillCooldown > 0 || Math.abs(posB - posA) > skill.rangeAttack}
                key={skill.id}
                onClick={() => handleClickSkill(skill)}
                colorScheme="teal"
                mr={4}
              >
                {skill.name}
              </Button>
            ))}
          </Box>
        </Box>
      </div>
    </Container>
  );
};

export default Home;
