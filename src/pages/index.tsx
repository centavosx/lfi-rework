import { Flex, Image, Text } from 'rebass'
import { theme } from '../utils/theme'

import { Carousel } from '../components/carousel'
import { Section } from '../components/sections'

import { useRouter } from 'next/router'
import { BoxWithTitle } from 'components/box'
import { ListContainer, ListItem } from 'components/ul'

type StepProps = {
  step: string
  title: string
  description: string
  image: string
}

type RequirementProps = {
  title: string
  description: string
  item: string[]
}

const REQUIREMENTS: RequirementProps[] = [
  {
    title: 'Requirements',
    description: 'These file attachments are required upon Sign Up application',
    item: [
      'ID Picture',
      'National Career Assessment Examination',
      'Certificate of Indigency',
      'Photocopy of Pantawid ID',
      'Grade Slip',
      'Photocopy of PSA Birth Certificate',
      'Autobiography',
      'Sketch of Home Address',
    ],
  },
  {
    title: 'Optional',
    description:
      'These file attachments are optional but required to show upon Home Visitation for Proof of Billing',
    item: ['Enrollment Slip', 'Electrical Bill', 'Water Bill', 'WiFi Bill'],
  },
]

const STEPS: StepProps[] = [
  {
    step: '01',
    title: 'Apply',
    description:
      'Click on the Sign Up Button to start the application process.',
    image: 'https://img.icons8.com/material-outlined/96/null/edit-file--v1.png',
  },
  {
    step: '02',
    title: 'Sign up',
    description: 'If you are not yet a scholar, sign up to be one of us.',
    image:
      'https://img.icons8.com/material-outlined/96/null/identification-documents.png',
  },
  {
    step: '03',
    title: 'Fill Out the Forms',
    description:
      'Fill all the forms presented with precise and credible information.',
    image:
      'https://img.icons8.com/material-outlined/96/null/application-form.png',
  },

  {
    step: '04',
    title: 'Submit',
    description:
      'Click on the submit button after filling all the forms with the needed data.',
    image:
      'https://img.icons8.com/material-outlined/96/null/submit-document.png',
  },
]

export default function Home() {
  const { replace } = useRouter()

  return (
    <>
      <Carousel
        fadeDuration={150}
        carouselContent={['lao2', 'lao3', 'lao4'].map((data, i) => (
          <Image
            rel="preload"
            key={i}
            src={`/assets/carousel/${data}.PNG`}
            alt="image"
            width={'100%'}
            height={[250, 350, 500, 650]}
          />
        ))}
        contentProps={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      />
      <Flex
        flexDirection={['column', 'row']}
        sx={{ position: 'relative', height: 'auto' }}
      >
        <Flex sx={{ flex: 1, backgroundColor: theme.colors.darkestGreen }}>
          <Section
            title="Our Mission"
            alignItems={'left'}
            textProps={{ textAlign: 'left', color: theme.colors.white }}
            contentProps={{ alignItems: 'left', height: '100%' }}
          >
            <Text color={theme.colors.white} as={'h2'} flex={1}>
              “Providing individuals with the opportunities to change their
              lives and the community”
            </Text>
            <Text color={theme.colors.white} flex={1}>
              Lao Foundation Inc. works to build people of character and skill
              by providing the necessary education, livelihood skills, and
              support to help them improve their lives. Our goal is to empower
              the less fortunate to attain a better life for themselves and the
              entire community.
            </Text>
          </Section>
        </Flex>
        <Flex sx={{ flex: 1 }}>
          <Section
            title="Our Vision"
            alignItems={'left'}
            textProps={{ textAlign: 'left' }}
            contentProps={{ alignItems: 'left', height: '100%' }}
          >
            <Text as={'h2'}>
              “Empowerment through Education, Values Formation, Livelihood
              Training and Leadership Development”
            </Text>
            <Text flex={1}>
              We believe that long-lasting change comes from within. That is why
              the Lao Foundation is focused on developing and investing in
              individuals, their families, as well as the community at large
              through various programs, not only to help them succeed in life,
              but also to encourage them to help others succeed. By providing
              them with education, values formation, and other necessary
              programs, it is our goal to mold empowered individuals that can
              contribute to building a sustainable and healthy community.
            </Text>
          </Section>
        </Flex>
      </Flex>
      <Flex
        flexDirection={['column', 'column', 'column', 'row']}
        sx={{ position: 'relative', height: 'auto', alignItems: 'center' }}
      >
        <Flex flex={1} pl={[0, 20]}>
          <Image
            rel="preload"
            src={`/assets/AboutUs.PNG`}
            alt="image"
            width={'100%'}
            height={'100%'}
          />
        </Flex>
        <Flex flex={1}>
          <Section
            title="How to apply"
            alignItems={'left'}
            textProps={{ textAlign: 'left' }}
            contentProps={{
              alignItems: 'left',
              height: '100%',
              pl: 10,
              pr: 10,
            }}
          >
            {STEPS.map((v, i) => (
              <Flex
                flexDirection={'row'}
                sx={{ gap: 4, alignItems: 'center' }}
                key={i}
              >
                <Flex flexDirection={'column'} flex={1}>
                  <Text as={'h2'} color={theme.colors.green}>
                    {v.step}
                  </Text>
                  <Text as={'h3'} color={theme.colors.green}>
                    {v.title}
                  </Text>
                  <Text mt={1}>{v.description}</Text>
                </Flex>
                <Image src={v.image} alt={'image'} />
              </Flex>
            ))}
          </Section>
        </Flex>
      </Flex>
      <Section
        title="Requirements"
        textProps={{
          color: theme.colors.white,
          padding: 50,
          backgroundColor: theme.colors.darkestGreen,
        }}
        padding={0}
        alignItems={'left'}
        contentProps={{
          flexDirection: ['column', 'row'],
          pl: 4,
          pr: 4,
          pb: 4,
          alignItems: 'start',
        }}
      >
        {REQUIREMENTS.map(({ title, description, item }, i) => (
          <BoxWithTitle
            flex={1}
            title={title}
            key={i}
            innerBoxProps={{ flexDirection: 'column' }}
          >
            <Text>{description}</Text>
            <ListContainer>
              {item.map((v, i) => (
                <ListItem key={i}>{v}</ListItem>
              ))}
            </ListContainer>
          </BoxWithTitle>
        ))}
      </Section>
      <Section
        title="Benefits"
        textProps={{
          color: theme.colors.white,
          padding: 50,
          backgroundColor: theme.colors.darkestGreen,
        }}
        padding={0}
        alignItems={'left'}
        contentProps={{
          flexDirection: ['column', 'row'],
          pl: 4,
          pr: 4,
          pb: 4,
          alignItems: 'start',
        }}
      >
        <ListContainer>
          {[
            'Monthly Kamustahan for Emotional Support and Character Development',
            'Tuition Fee',
            'Weekly Meal and Transpo Allowance',
            'Every Sem Miscellaneous Fee',
          ].map((v, i) => (
            <ListItem
              key={i}
              color="black"
              style={{ color: 'black', fontSize: 20, fontWeight: '600' }}
            >
              {v}
            </ListItem>
          ))}
        </ListContainer>
      </Section>
    </>
  )
}
