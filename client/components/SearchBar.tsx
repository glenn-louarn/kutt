import React, { useState, useEffect, useCallback } from "react";
import { useFormState } from "react-use-form-state";
import { Flex, BoxProps } from "reflexbox/styled-components";
import debounce from 'debounce'
import getConfig from "next/config";

import styled, { css }  from "styled-components";
import { prop, ifProp } from "styled-tools";
import { useStoreActions, useStoreState } from "../store";
import { Col } from "./Layout";
import Text, { H2 } from "../components/Text";
import { useTranslation } from 'react-i18next';
import ALink from "./ALink";
import { TextInput } from "./Input";
import { NavButton } from "./Button";
import Icon from "./Icon";
import { transparentize } from 'polished';
import { useTheme } from "../hooks";
import { useWindowEvent } from "../hooks";

const { publicRuntimeConfig } = getConfig();
interface Form {
  all: boolean;
  limit: string;
  skip: string;
  search: string;
  searchable: boolean;
}

const FORM_PARAMS = {
  skip: "0",
  limit: "10",
  all: false,
  searchable: true
}

const FORM_OPTIONS = {
  withIds: true
}
interface ContainerProps extends BoxProps {
  notEmpty?: boolean;
}
const Container = styled(Col) <ContainerProps>`
  margin-left: 10px;
  margin-top: 10px;
  background-color: ${prop("theme.background.accent")};
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 10px 35px ${prop("theme.table.shadow")};
  border: none;
  border-radius: ${prop("br", "30px")};
  border-bottom: 5px solid ${prop("theme.table.border")};
  ${ifProp("notEmpty", `padding-bottom: 18px;`)}  
  border-bottom-width: ${prop("bbw", "5px")};
  transition: all 0.5s ease-out;
  @media screen and (min-width: 52em) {
    letter-spacing: 0.1em;
    border-bottom-width: ${prop("bbw", "6px")};
  }
￼`;

interface LinksContainerProps extends BoxProps {
  selected?: boolean;
}

const LinksContainer = styled(Flex) <LinksContainerProps>`
  box-sizing: border-box;
  position: relative;
  letter-spacing: 0.05em;
  background-color: ${prop("theme.table.row")};
  color: #444; 
  border: none;
  border-top: 1px solid ${prop("theme.table.border")};
  transition: all 0.2s ease-out;
  :hover { 
    background-color: ${prop("theme.table.rowHover")};
  };
  ${ifProp(
  "selected",
  css`
      background-color:  ${prop("theme.table.rowHover")};
      box-shadow: 0 0px 2px  ${({theme}) => transparentize(0.9, theme.text.main)};
      cursor: default;
      :hover {
        transform: none;
      }
    `
)}
￼`

const LinkTarget = styled(ALink)`
  border-bottom: none;
  margin-left: 15px;
  margin-top: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden; 
`

const SearchBar = () => {
  const theme = useTheme()
  const { t } = useTranslation("search");
  const links = useStoreState(s => s.links);
  const [position, setPosition] = useState<number>(0)
  const get = useStoreActions(s => s.links.get);
  const reset = useStoreActions(s => s.links.reset)
  const [formState, { text }] = useFormState<Form>(
    FORM_PARAMS,
    FORM_OPTIONS
  );
  const getLinks = useCallback((formValues) =>
  get({
    ...formValues,
    skip: parseInt(formValues.skip, 10),
    limit: parseInt(formValues.limit, 10)
  })
, [get])
  const debouncedGet = useCallback(debounce(getLinks, 300), [getLinks]);

  let options = formState.values;

  const onNavChange = (nextPage: number) => () => {
    formState.setField("skip", (parseInt(options.skip) + nextPage).toString());
  };
  // const 
  useEffect(() => {
    getLinks(options)
  }, [options.skip]);

  useEffect(() => {
    formState.setField("skip", "0");
    if (formState.values.search.length === 0) {
      reset();
    } else {
      debouncedGet({ ...options, skip: "0" });
    }
  }, [formState.values?.search]);


  //reset (link selected by the first link)
  useEffect(() => {
    setPosition(links.items[0] ? 0 : undefined)
    if (formState.values?.search === "" && links.items[0] !== undefined) {
      reset();
    }
  }, [get, links])


  //special key
  const handleUserKeyPress = event => {
    const { key } = event;
    if (links.items.length != 0) {
      switch (key) {
        case "Enter":
          window.location.replace(links.items[position].target);
          break;
        case "ArrowUp":
          setPosition(position === 0 ? links.items.length - 1 : (position - 1))
          break;
        case "ArrowDown":
          setPosition((position >= (links.items.length - 1)) ? 0 : (position + 1))
          break;
      }
    }
  };
  useWindowEvent('keyup', handleUserKeyPress);


  return (
    <Col width={800} maxWidth="100%" px={[3]} flex="0 0 auto" mt={4}>
      <Flex
        id="shortenerform"
        width={1}
        alignItems="start"
        justifyContent="center"
        style={{ position: "relative" }}
      >
        <H2 my={4} light >
          {publicRuntimeConfig.SITE_NAME}/
        </H2>
        <Container
          width={[400, 500, 650]}
          notEmpty={links.items.length > 0}
          data-lpignore>
          <TextInput
            {...text("search")}
            placeholder={t('phSearch')}
            autoComplete="off"
            placeholderSize={[16, 17, 18]}
            fontSize={[18, 20, 22]}
            height={[52, 58, 64]}
            width={[400, 500, 650]}
            br="30px"
            bbw="0px"
            px={0}
            pr={[20, 25]}
            pl={[20, 25]}
            autoFocus
            data-lpignore
            shadow={false}
          />
          {links.items.map((link, index) => (
            <LinksContainer
              selected={index === position}
              fontSize={[14, 16, 18]}
              height={(index === position) ? "auto" : [40, 45, 50]}
              minHeight={[40, 45, 50]}
              pr={[15, 20]}
              pl={[15, 20]}
              key={link.id}>
              <Col alignItems="flex-start" >

                <Flex>
                  <ALink href={link.target} >go/{link.address}</ALink>
                  <LinkTarget href={link.target}
                    fontSize={[13, 14]}
                    width={[200, 300, 400]}>
                    ({link.target})
                    </LinkTarget>
                </Flex>

                {link.description && (
                  <Text fontSize={[13, 14]} color={theme.text.placeholder}>
                    {link.description}

                  </Text>
                )}
              </Col></LinksContainer>
          ))}
          {links.total > parseInt(FORM_PARAMS.limit) && (<Flex
            alignItems="center"
            justifyContent="center">
            <NavButton
              onClick={onNavChange(-parseInt(options.limit))}
              disabled={options.skip === "0"}
              px={2}
            >
              <Icon name="chevronLeft" size={15} />
            </NavButton>
            <NavButton
              onClick={onNavChange(parseInt(options.limit))}
              disabled={
                parseInt(options.skip) + parseInt(options.limit) > links.total
              }
              ml={12}
              px={2}
            >
              <Icon name="chevronRight" size={15} />
            </NavButton>
          </Flex>)}
        </Container>
      </Flex>
    </Col>
  );
};

export default SearchBar;