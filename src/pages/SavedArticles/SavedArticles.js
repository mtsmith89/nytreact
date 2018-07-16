import React, { Component } from "react";
import API from "../../utils/API";
import { Article } from "../../components/Article";
import Jumbotron from "../../components/Jumbotron";
import { H1, H3 } from "../../components/Grid";
import { Panel, PanelHeading, PanelBody } from "../../components/Panel";

export default class SavedArticles extends Component {
  state = {
    savedArticles: []
  };

  componentWillMount() {
    this.loadArticles();
  }

  loadArticles = () => {
    API.getArticles().then(results => {
      this.setState({ savedArticles: results.data });
    });
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(results => {
        let savedArticles = this.state.savedArticles.filter(
          article => article._id !== id
        );
        this.setState({ savedArticles: savedArticles });
        this.loadArticles();
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="sm-10" offset="sm-1">
            <Jumbotron>
              <H1 className="text-center">Saved New York Times Articles</H1>
              <hr style={{ width: "60%" }} />
            </Jumbotron>
            <Panel>
              <PanelHeading>
                <H3>Saved Articles</H3>
              </PanelHeading>
              <PanelBody>
                {this.state.savedArticles.length > 0 ? (
                  this.state.savedArticles.map((article, i) => (
                    <Article
                      key={i}
                      title={article.title}
                      url={article.url}
                      summary={article.summary}
                      date={article.date}
                      type="Delete"
                      onClick={() => this.deleteArticle(article._id)}
                    />
                  ))
                ) : (
                  <H1>You have no saved articles.</H1>
                )}
              </PanelBody>
            </Panel>
          </Col>
        </Row>
      </Container>
    );
  }
}
