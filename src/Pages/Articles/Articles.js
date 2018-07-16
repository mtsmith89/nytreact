import React, { Component } from "react";
import API from "../../utils/API";
import { Article } from "../../components/Article";
import Jumbotron from "../../components/Jumbotron";
import { H1, H3, H4 } from "../../components/Headings";
import { Container, Row, Col } from "../../components/Grid";
import { Panel, PanelHeading, PanelBody } from "../../components/Panel";
import { Form, Input, FormBtn, FormGroup, Label } from "../../components/Form";

export default class Articles extends Component {
  state = {
    topic: "",
    sYear: "",
    eYear: "",
    page: "0",
    results: [],
    previousSearch: {},
    noResults: false
  };

  saveArticle = article => {
    let newArticle = {
      date: article.pub_date,
      title: article.headline.main,
      url: article.web_url,
      summary: article.snippet
    };

    API.saveArticle(newArticle)
      .then(results => {
        let unsavedArticles = this.state.results.filter(
          article => article.headline.main !== newArticle.title
        );
        this.setState({ results: unsavedArticles });
      })
      .catch(err => console.log(err));
  };

  handleInputChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    let { topic, sYear, eYear } = this.state;
    let query = { topic, sYear, eYear };
    this.getArticles(query);
  };

  getArticles = query => {
    if (
      query.topic !== this.state.previousSearch.topic ||
      query.eYear !== this.state.previousSearch.eYear ||
      query.sYear !== this.state.previousSearch.sYear
    ) {
      this.setState({ results: [] });
    }
    let { topic, sYear, eYear } = query;
    let queryUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest&page=${
      this.state.page
    }`;
    let key = `&api-key=33c676fd7fd14e90a532f9698ab4dd4a`;

    if (topic.indexOf(" ") >= 0) {
      topic = topic.replace(/\s/g, "+");
    }
    if (topic) {
      queryUrl += `&fq=${topic}`;
    }
    if (sYear) {
      queryUrl += `&begin_date=${sYear}`;
    }
    if (eYear) {
      queryUrl += `&end_date=${eYear}`;
    }
    queryUrl += key;

    API.queryNYT(queryUrl)
      .then(results => {
        this.setState(
          {
            results: [...this.state.results, ...results.data.response.docs],
            previousSearch: query,
            topic: "",
            sYear: "",
            eYear: ""
          },
          () => {
            this.state.results.length === 0
              ? this.setState({ noResults: true })
              : this.setState({ noResults: false });
          }
        );
      })
      .catch(err => console.log(err));
  };

  getMoreResults = () => {
    let { topic, eYear, sYear } = this.state.previousSearch;
    let query = { topic, eYear, sYear };
    let page = this.state.page;
    page++;
    this.setState({ page: page }, () => {
      this.getArticles(query);
    });
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="sm-10" offset="sm-1">
            <Jumbotron>
              <H1 className="page-header text-center">
                New York Times Article Search
              </H1>
              <H4 className="text-center">
                Search for and save articles of interest
              </H4>
            </Jumbotron>
            <Panel>
              <PanelHeading>
                <H3>Search</H3>
              </PanelHeading>
              <PanelBody>
                <Form style={{ marginBottom: "30px" }}>
                  <FormGroup>
                    <Label htmlFor="topic">Enter a topic to search for:</Label>
                    <Input
                      onChange={this.handleInputChange}
                      name="topic"
                      value={this.state.topic}
                      placeholder="Topic"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="sYear">
                      Enter a beginning date to search from (optional):
                    </Label>
                    <Input
                      onChange={this.handleInputChange}
                      type="date"
                      name="sYear"
                      value={this.state.sYear}
                      placeholder="Start Year"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="eYear">
                      Enter an end date to search up until (optional):
                    </Label>
                    <Input
                      onChange={this.handleInputChange}
                      type="date"
                      name="eYear"
                      value={this.state.eYear}
                      placeholder="End Year"
                    />
                  </FormGroup>
                  <FormBtn
                    disabled={!this.state.topic}
                    onClick={this.handleFormSubmit}
                    type="info"
                  >
                    Submit
                  </FormBtn>
                </Form>
              </PanelBody>
            </Panel>
            {this.state.noResults ? (
              <H1>No Results Found. Please Try Again</H1>
            ) : this.state.results.length > 0 ? (
              <Panel>
                <PanelHeading>
                  <H3>Results</H3>
                </PanelHeading>
                <PanelBody>
                  {this.state.results.map((article, i) => (
                    <Article
                      key={i}
                      title={article.headline.main}
                      url={article.web_url}
                      summary={article.snippet}
                      date={article.pub_date}
                      type="Save"
                      onClick={() => this.saveArticle(article)}
                    />
                  ))}
                  <FormBtn
                    type="warning"
                    additional="btn-block"
                    onClick={this.getMoreResults}
                  >
                    Get More Results
                  </FormBtn>
                </PanelBody>
              </Panel>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
