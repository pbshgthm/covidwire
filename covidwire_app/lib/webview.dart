import 'dart:async';
import 'package:flutter/material.dart';


import 'package:webview_flutter/webview_flutter.dart';

class GetStatusBarHeight extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
  double statusBarHeight = MediaQuery.of(context).padding.top;

    return Text('Status Bar Height = ' + statusBarHeight.toString(), 
            style: TextStyle(fontSize: 30));
    }
}

class MyWebView extends StatelessWidget {
  final String title;
  final String selectedUrl;

  final Completer<WebViewController> _controller =
      Completer<WebViewController>();

  MyWebView({
    @required this.title,
    @required this.selectedUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: PreferredSize(
          preferredSize: Size.fromHeight(0.0), // here the desired height
          child: AppBar()
        ),
        body: WebView(
          initialUrl: selectedUrl,
          javascriptMode: JavascriptMode.unrestricted,
          onWebViewCreated: (WebViewController webViewController) {
            _controller.complete(webViewController);
          },
        ));
  }
}